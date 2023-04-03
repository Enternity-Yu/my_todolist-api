import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TaskModule } from '../src/task/task.module';

describe('AppController (e2e)', () => {
  let task: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TaskModule],
    }).compile();

    task = moduleFixture.createNestApplication();
    await task.init();
  });

  it('/Get user', () => {
    return request(task.getHttpServer()).get('/').expect(200).expect('');
  });
});
