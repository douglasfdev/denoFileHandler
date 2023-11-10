import {
  ApiFactory,
  CreateBucketOutput,
  CreateBucketRequest,
  PutObjectOutput,
  S3,
  GetObjectOutput,
} from "$deps";
import {
  awsS3Config,
  env,
  log
} from "$common";

class SimpleCloudStorage {
  private s3: S3;
  private apiFactory: ApiFactory;
  private bucketName = env.S3_BUCKET_NAME;

  constructor(
    s3: S3,
    apiFactory: ApiFactory
  ) {
    this.s3 = s3;
    this.apiFactory = apiFactory;
    this.init();
  }

  public async init() {
    return this.createBucket();
  }

  public async handlerBucket(body: Uint8Array, objectKey: string): Promise<PutObjectOutput> {
    return await this.setBucket(body, objectKey);
  }

  private async setBucket(body: Uint8Array, objectKey: string): Promise<PutObjectOutput> {
    const s3 = await this.makeNewBucket();

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
    const s3 = await this.makeNewBucket();
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
    const s3 = await this.makeNewBucket();
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
    const s3 = await this.makeNewBucket()
    const createBucket = await s3.createBucket(this.configBucket());
    return createBucket;
  }

  private configBucket(): CreateBucketRequest {
    return {
      ACL: "private",
      Bucket: this.bucketName,
    }
  }

  private async makeNewBucket(): Promise<S3> {
    return this.apiFactory.makeNew(S3);
  }
}

await new SimpleCloudStorage(
  new S3(new ApiFactory()),
  new ApiFactory(awsS3Config),
).init();

export default new SimpleCloudStorage(
  new S3(new ApiFactory()),
  new ApiFactory(awsS3Config),
);
