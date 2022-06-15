import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { AuthDto } from 'src/auth/dto/auth.dto';
import * as request from 'supertest';

const loginDto: AuthDto = {
  login: 'user1@mail.ru',
  password: '123',
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) - success', (done) => {
    request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        token = body.access_token;
        expect(token).toBeDefined();
        done();
      });
  });

  it('/auth/login (POST) - fail(wrong email)', () => {
    request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, login: 'user2@mail.ru' })
      .expect(401, {
        statusCode: 401,
        message: 'Пользователь с таким email не найден',
        error: 'Unauthorized',
      });
  });

  it('/auth/login (POST) - fail(wrong password)', () => {
    request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, password: '12345' })
      .expect(401, {
        statusCode: 401,
        message: 'Неверный пароль',
        error: 'Unauthorized',
      });
  });
});
