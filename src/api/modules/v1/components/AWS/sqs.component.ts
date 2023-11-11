import {
  ApiFactory,
  SQS,
  CreateQueueRequest,
  CreateQueueResult,
  GetQueueUrlRequest,
  GetQueueUrlResult,
  SendMessageResult,
  Message
} from '$deps';
import {
IPersonDTO,
  env,
  log,
} from '$common';

export class SimpleQueueService {
  private apiFactory: ApiFactory = new ApiFactory({
    region: env.AWS_REGION,
    fixedEndpoint: env.AWS_ENDPOINT,
    credentials: {
      awsAccessKeyId: env.AWS_ACCESS_KEY_ID,
      awsSecretKey: env.AWS_SECRET_ACCESS_KEY,
      region: env.AWS_REGION,
    }
  });

  private sqsQueue = env.SQS_QUEUE_NAME;

  constructor() {
    this.init();
  }

  public async handleQueue(body: Partial<IPersonDTO>): Promise<SendMessageResult> {
    return this.buildQueue(body);
  }

  private async buildQueue(body: Partial<IPersonDTO>): Promise<SendMessageResult> {
    const sqs = this.sqsHandler();

    try {
      const queueUrl = await this.getQueueUrl();

      console.log(await this.receiptMessage());

      return sqs.sendMessage({
        MessageBody: JSON.stringify(body, null, 2),
        QueueUrl: queueUrl,
      });
    } catch (e) {
      log.error(e.message);
      throw new Error(e.message);
    }
  }

  public async handleReceiptMessage(): Promise<Array<Message>> {
    return this.receiptMessage();
  }

  public async receiptMessage(): Promise<Array<Message>> {
    const sqs = this.sqsHandler();

    try {
      const queueUrl = await this.getQueueUrl();

      const receiptMessage = await sqs.receiveMessage({
        QueueUrl: queueUrl
      });

      return receiptMessage.Messages;
    } catch (e) {
      log.error(e.message);
      throw new Error(e.message);
    }
  }

  private async getQueueUrl(): Promise<string> {
    const sqs = this.sqsHandler();
    const result: GetQueueUrlResult = await sqs.getQueueUrl({
      QueueName: this.sqsQueue,
    });

    return result.QueueUrl as string;
  }

  private init(): Promise<CreateQueueResult> {
    return this.createQueue();
  }

  private sqsHandler(): SQS {
    return this.apiFactory.makeNew(SQS);
  }

  private createQueue(): Promise<CreateQueueResult> {
    const sqs = this.sqsHandler();
    return sqs.createQueue(this.configQueue());
  }

  private configQueue(): CreateQueueRequest {
    return {
      QueueName: this.sqsQueue,
      tags: { v1: 'v1' },
    };
  }
}

export default new SimpleQueueService();
