import {
  ApiFactory,
  CreateBucketOutput,
  CreateBucketRequest,
  PutObjectOutput,
  S3,
  GetObjectOutput,
} from "$deps";
import {
  env,
  log
} from "$common";

export class SimpleCloudStorage {
  private apiFactory: ApiFactory;
  private bucketName = env.S3_BUCKET_NAME;

  constructor(
    apiFactory: ApiFactory
  ) {
    this.apiFactory = apiFactory;
    this.init();
  }

  private init() {
    return this.createBucket();
  }

  public async handlerBucket(body: Uint8Array, objectKey: string): Promise<PutObjectOutput> {
    return await this.setBucket(body, objectKey);
  }

  private setBucket(body: Uint8Array, objectKey: string): Promise<PutObjectOutput> {
    const s3 = this.makeNewBucket();

    return s3.putObject({
      Body: body,
      Bucket: this.bucketName,
      Key: objectKey,
    })
  }

  public async readFileFromS3(objectKey: string): Promise<Array<string> | undefined> {
    return this.handleReadFile(objectKey);
  }

  private async handleReadFile(objectKey: string): Promise<Array<string> | undefined> {
    const s3 = this.makeNewBucket();

    try {
      const result = await s3.getObject({
        Bucket: this.bucketName,
        Key: objectKey,
      });

      if (result.Body) {
        const reader = result.Body.getReader();
        const chunck: Array<Uint8Array> = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunck.push(value);
        }
        const [value] = chunck;
        return new TextDecoder('utf-8').decode(value).replace(/\r\n|\n/g, "\n").split('\n');
      }
      // deno-lint-ignore no-explicit-any
    } catch (er: Error | any | unknown) {
      log.error(er.message);
    }
  }

  public async downloadFileFromS3(objectKey: string): Promise<string | undefined> {
    return this.handleDownloadFile(objectKey);
  }

  private async handleDownloadFile(objectKey: string): Promise<string | undefined> {
    const s3 = this.makeNewBucket();
    try {
      const result: GetObjectOutput = await s3.getObject({
        Bucket: this.bucketName,
        Key: objectKey,
      });

      if (result.Body) {
        const chunks: Array<Uint8Array> = [];
        const reader = result.Body.getReader();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
        }
        const [value] = chunks;
        return new TextDecoder('utf-8').decode(value).replace(/\r\n|\n/g, "\n").split('\n').join('\n');
      }
    } catch (error) {
      log.error(error.message);
    }
  }

  private async createBucket(): Promise<CreateBucketOutput> {
    const s3 = this.makeNewBucket();
    const createBucket = await s3.createBucket(this.configBucket());
    return createBucket;
  }

  private configBucket(): CreateBucketRequest {
    return {
      ACL: "public-read",
      Bucket: this.bucketName,
    }
  }

  private makeNewBucket(): S3 {
    return this.apiFactory.makeNew(S3);
  }
};

export default new SimpleCloudStorage(
  new ApiFactory({
    region: env.AWS_REGION,
    fixedEndpoint: env.AWS_ENDPOINT,
    credentials: {
      awsAccessKeyId: env.AWS_ACCESS_KEY_ID,
      awsSecretKey: env.AWS_SECRET_ACCESS_KEY,
      region: env.AWS_REGION,
    }
  }),
);
