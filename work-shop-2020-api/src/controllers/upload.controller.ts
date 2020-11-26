import {
  BlobServiceClient,
  newPipeline,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';
import {inject} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {
  post,
  Request,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import {Document, TypeDocument} from '../models';
import {DocumentRepository, TypeDocumentRepository} from '../repositories';
import multer = require('multer');
import PredictionApi = require('@azure/cognitiveservices-customvision-prediction');
import TrainingApi = require('@azure/cognitiveservices-customvision-training');
import msRest = require('@azure/ms-rest-js');
import getStream = require('into-stream');

const trainingKey: string = process.env.TRAINING_KEY!;
const predictionKey: string = process.env.PREDICTION_KEY!;
const predictionResourceId: string = process.env.PREDICTION_RESOURCE_ID!;
const endPoint: string = process.env.END_POINT!;

export class UploadController {
  constructor(
    @repository(DocumentRepository)
    public documentRepository: DocumentRepository,
    @repository(TypeDocumentRepository)
    public typeDocumentRepository: TypeDocumentRepository,
  ) {}
  @post('/Import', {
    responses: {
      '200': {
        description: 'File imported',
        content: {
          'application/json': {
            schema: {type: 'object'},
          },
        },
      },
    },
  })
  async importFile(
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,
      content: {
        'multipart/form-data': {
          'x-parser': 'stream',
          schema: {type: 'object'},
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<any> {
    const storage = multer.memoryStorage();
    const upload = multer({storage});
    const buffer = new Promise<any>((resolve, reject) => {
      upload.any()(request, response, (err: any) => {
        if (err) reject(err);
        else {
          resolve({
            files: request.files,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            fields: (request as any).fields,
            body: request.body,
          });
        }
      });
    });

    const bufferResult = await buffer;

    try {
      if (bufferResult.body['userId'] != null) {
        const file: Express.Multer.File = bufferResult.files[0];
        const credentials = new msRest.ApiKeyCredentials({
          inHeader: {'Training-key': trainingKey},
        });
        const trainer = new TrainingApi.TrainingAPIClient(
          credentials,
          endPoint,
        );
        const predictorCredentials = new msRest.ApiKeyCredentials({
          inHeader: {'Prediction-key': predictionKey},
        });
        const predictor = new PredictionApi.PredictionAPIClient(
          predictorCredentials,
          endPoint,
        );
        const results = await predictor.classifyImage(
          process.env.PROJECT_ID!,
          process.env.PUBLISH_ITERATION_NAME!,
          file.buffer,
        );

        const id = results.predictions?.[0].tagId;
        const whereCondition: Filter<TypeDocument> = {
          where: {
            uuid: id,
          },
        };
        const typeDocument = await this.typeDocumentRepository.findOne(
          whereCondition,
        );

        // ----- S3 ------
        const sharedKeyCredential = new StorageSharedKeyCredential(
          process.env.S3_ACCOUNT_NAME!,
          process.env.S3_ACCESS_KEY!,
        );
        const pipeline = newPipeline(sharedKeyCredential);

        const url = `https://${process.env.S3_ACCOUNT_NAME}.blob.core.windows.net`;
        const blobServiceClient = new BlobServiceClient(url, pipeline);

        const uploadOptions = {bufferSize: 4 * 1024 * 1024, maxBuffers: 20};
        const blobName = Date.now().toString() + file.originalname;
        const stream = getStream(file.buffer);
        const containerName = process.env.S3_CONTAINER_NAME!;
        const containerClient = blobServiceClient.getContainerClient(
          containerName,
        );
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        try {
          await blockBlobClient.uploadStream(
            stream,
            uploadOptions.bufferSize,
            uploadOptions.maxBuffers,
            {blobHTTPHeaders: {blobContentType: 'image/jpeg'}},
          );
        } catch (err) {
          response.statusCode = 400;
          return response.json({message: err.message});
        }

        const newDocument: Document = new Document({
          url: url + '/mycontainer/' + blobName,
          label: blobName,
          typeDocumentId: typeDocument?.id,
          userId: bufferResult.body['userId'],
        });
        await this.documentRepository.create(newDocument);
        return response.json({prediction: results, document: newDocument});
      } else {
        response.statusCode = 400;
        return response.json({error: 'Veuillez renseinger un id'});
      }
    } catch (err) {
      response.statusCode = 400;
      return response.json({message: err.message});
    }
  }
}
