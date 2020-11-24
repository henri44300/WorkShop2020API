import {
  post,
  requestBody,
  RestBindings,
  Request,
  Response,
} from '@loopback/rest';
import {inject} from '@loopback/core';
import multer = require('multer');
import {repository} from '@loopback/repository';

const configAzure = {
  trainingKey: process.env.TRAINING_KEY,
  predictionKey: process.env.PREDICTION_KEY,
  predictionResourceId: process.env.PREDICTION_RESOURCE_ID,
  endPoint: process.env.END_POINT,
};

export class UploadController {
  constructor() {}
  @post('/Import', {
    responses: {
      '200': {
        description: 'File ',
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

    return;
  }
}
/*const buffer = new Promise<any>((resolve, reject) => {
      upload.any()(request, response, err => {
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
    const file: Express.Multer.File = bufferResult.files[0];
    const bufferToString: string = file.buffer.toString();
    const DataJsonArray = await csv({
      delimiter: ';',
      trim: true,
    }).fromString(bufferToString);

    const fileJsonToSend: Partial<File> = {
      //date: new Date().toString(),
    };

    const fileInserted: File = await this.fileRepository.create(fileJsonToSend);

    /*DataJsonArray.forEach(
      async (element: {id: string; name: string; value: string}) => {
        const dataJsonToSend: Partial<Data> = {
          refId: +element.id,
          name: element.name,
          value: element.value,
        };
        await this.fileRepository
          .data(fileInserted.getId())
          .create(dataJsonToSend);
      },
    );
    return fileInserted;*/
