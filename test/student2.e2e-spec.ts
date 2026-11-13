import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UniConnect Student 2 E2E Tests (Social Feed, Connections, Notifications)', () => {
  let app: INestApplication;

  const userA = 'c2d3e4f5-a1b2-4c3d-8e9f-0123456789ab';
  const userB = 'd3e4f5a6-b2c3-4d4e-9f0a-1234567890bc';
  let createdPostId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  // 1. Health checks across all 3 Student 2 modules
  describe('1. Health Checks', () => {
    it('GET /feed/health-check should return 200 OK', () => {
      return request(app.getHttpServer())
        .get('/feed/health-check')
        .expect(200);
    });

    it('GET /connections/health-check should return 200 OK', () => {
      return request(app.getHttpServer())
        .get('/connections/health-check')
        .expect(200);
    });

    it('GET /notifications/health-check should return 200 OK', () => {
      return request(app.getHttpServer())
        .get('/notifications/health-check')
        .expect(200);
    });
  });

  // 2. Social Feed Workflows
  describe('2. Social Feed Workflows', () => {
    it('POST /feed/posts with empty content and empty media should return 400 Bad Request', () => {
      return request(app.getHttpServer())
        .post('/feed/posts')
        .set('user-id', userA)
        .send({ content: '' })
        .expect(400);
    });

    it('POST /feed/posts with valid content should return 201 Created and save postId', async () => {
      const response = await request(app.getHttpServer())
        .post('/feed/posts')
        .set('user-id', userA)
        .send({
          content: 'UniConnect Student 2 (Nizam Uddin Shuvo, 23-51568-2) E2E Test Post!',
        })
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBeDefined();
      createdPostId = response.body.id;
    });

    it('PATCH /feed/posts/:id with wrong user-id header should return 403 Forbidden', () => {
      return request(app.getHttpServer())
        .patch(`/feed/posts/${createdPostId}`)
        .set('user-id', userB) // userB is NOT the author of post created by userA
        .send({ content: 'Unauthorized edit attempt' })
        .expect(403);
    });

    it('POST /feed/posts/:postId/reactions twice with same reaction should toggle (added -> removed)', async () => {
      // Step A: First reaction -> 'added'
      const res1 = await request(app.getHttpServer())
        .post(`/feed/posts/${createdPostId}/reactions`)
        .set('user-id', userB)
        .send({ user_id: userB, reaction_type: 'like' })
        .expect(201);

      expect(res1.body.action).toBe('added');

      // Step B: Second reaction with identical type -> 'removed'
      const res2 = await request(app.getHttpServer())
        .post(`/feed/posts/${createdPostId}/reactions`)
        .set('user-id', userB)
        .send({ user_id: userB, reaction_type: 'like' })
        .expect(201);

      expect(res2.body.action).toBe('removed');
    });
  });

  // 3. Connections Workflows
  describe('3. Connections Workflows', () => {
    it('POST /connections/request/:targetUserId followed by reverse request should return 409 Conflict', async () => {
      // Step A: User A sends request to User B -> 201 Created
      await request(app.getHttpServer())
        .post(`/connections/request/${userB}`)
        .set('user-id', userA)
        .expect(201);

      // Step B: Reverse request from User B to User A while pending -> 409 Conflict
      return request(app.getHttpServer())
        .post(`/connections/request/${userA}`)
        .set('user-id', userB)
        .expect(409);
    });
  });

  // 4. Notifications Workflows
  describe('4. Notifications Workflows', () => {
    it('GET /notifications/unread-count without user-id header should return 401 Unauthorized', () => {
      return request(app.getHttpServer())
        .get('/notifications/unread-count')
        .expect(401);
    });

    it('GET /notifications/unread-count with valid user-id header should return 200 OK', async () => {
      const response = await request(app.getHttpServer())
        .get('/notifications/unread-count')
        .set('user-id', userA)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(typeof response.body.unread_count).toBe('number');
    });
  });
});

