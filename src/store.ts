import { AppData, User, Survey, Response, Question } from './types';
import { uid, hashPassword, generateSalt } from './utils';

const STORAGE_KEY = 'surveypro_v5';
const CURRENT_VERSION = 5;

class Storage {
  load(): AppData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const def: AppData = {
        users: [],
        surveys: [],
        responses: [],
        session: null,
        version: CURRENT_VERSION,
      };
      if (!raw) return def;
      const parsed = JSON.parse(raw);
      return { ...def, ...parsed };
    } catch {
      return {
        users: [],
        surveys: [],
        responses: [],
        session: null,
        version: CURRENT_VERSION,
      };
    }
  }

  save(data: AppData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      console.error('Ошибка сохранения данных');
    }
  }
}

export class DataStore {
  private storage = new Storage();
  private state: AppData;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.storage.load();
    this.seedDemo();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  private persist() {
    this.storage.save(this.state);
    this.notify();
  }

  getState(): AppData {
    return this.state;
  }

  // === Пользователи ===
  async register(name: string, email: string, password: string): Promise<User> {
    email = email.toLowerCase().trim();
    if (this.state.users.some((u) => u.email === email)) {
      throw new Error('Пользователь с таким email уже существует');
    }
    const salt = generateSalt();
    const passwordHash = await hashPassword(password, salt);
    const user: User = {
      id: uid(),
      name: name.trim(),
      email,
      passwordHash,
      salt,
      role: 'user',
      createdAt: Date.now(),
    };
    this.state.users.push(user);
    this.state.session = user.id;
    this.persist();
    return user;
  }

  async login(email: string, password: string): Promise<User> {
    email = email.toLowerCase().trim();
    const user = this.state.users.find((u) => u.email === email);
    if (!user) throw new Error('Пользователь не найден');
    const hash = await hashPassword(password, user.salt);
    if (user.passwordHash !== hash) throw new Error('Неверный пароль');
    this.state.session = user.id;
    this.persist();
    return user;
  }

  logout() {
    this.state.session = null;
    this.persist();
  }

  currentUser(): User | null {
    if (!this.state.session) return null;
    return this.state.users.find((u) => u.id === this.state.session) || null;
  }

  getAllUsers(): User[] {
    return this.state.users;
  }

  deleteUser(userId: string) {
    this.state.users = this.state.users.filter((u) => u.id !== userId);
    const removedSurveys = this.state.surveys
      .filter((s) => s.ownerId === userId)
      .map((s) => s.id);
    this.state.surveys = this.state.surveys.filter((s) => s.ownerId !== userId);
    const removedSet = new Set(removedSurveys);
    this.state.responses = this.state.responses.filter((r) => !removedSet.has(r.surveyId));
    this.persist();
  }

  // === Опросы ===
  getSurveysByUser(userId: string): Survey[] {
    return this.state.surveys.filter((s) => s.ownerId === userId);
  }

  getAllSurveys(): Survey[] {
    return this.state.surveys;
  }

  getPublicSurveys(): Survey[] {
    return this.state.surveys.filter((s) => s.isPublic && s.published);
  }

  getSurvey(id: string): Survey | undefined {
    return this.state.surveys.find((s) => s.id === id);
  }

  createSurvey(
    data: { title: string; description: string; questions: Question[]; isPublic: boolean; published: boolean },
    ownerId: string
  ): Survey {
    const survey: Survey = {
      id: uid(),
      ownerId,
      title: data.title,
      description: data.description,
      questions: data.questions,
      isPublic: data.isPublic !== false,
      published: data.published !== false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.state.surveys.unshift(survey);
    this.persist();
    return survey;
  }

  duplicateSurvey(id: string, ownerId: string): Survey | null {
    const original = this.getSurvey(id);
    if (!original) return null;
    return this.createSurvey(
      {
        title: original.title + ' (копия)',
        description: original.description,
        questions: original.questions.map((q) => ({ ...q, id: uid() })),
        isPublic: original.isPublic,
        published: false,
      },
      ownerId
    );
  }

  updateSurvey(
    id: string,
    data: { title: string; description: string; questions: Question[]; isPublic: boolean; published: boolean }
  ): Survey | null {
    const s = this.getSurvey(id);
    if (!s) return null;
    Object.assign(s, {
      title: data.title,
      description: data.description,
      questions: data.questions,
      isPublic: data.isPublic !== false,
      published: data.published !== false,
      updatedAt: Date.now(),
    });
    this.persist();
    return s;
  }

  togglePublish(id: string): Survey | null {
    const s = this.getSurvey(id);
    if (!s) return null;
    s.published = !s.published;
    s.updatedAt = Date.now();
    this.persist();
    return s;
  }

  deleteSurvey(id: string) {
    this.state.surveys = this.state.surveys.filter((s) => s.id !== id);
    this.state.responses = this.state.responses.filter((r) => r.surveyId !== id);
    this.persist();
  }

  // === Ответы ===
  addResponse(
    surveyId: string,
    answers: Record<string, string | number>,
    meta: { userId?: string | null; guest?: string | null; duration?: number } = {}
  ): Response {
    const response: Response = {
      id: uid(),
      surveyId,
      answers,
      userId: meta.userId || null,
      guest: meta.guest || null,
      createdAt: Date.now(),
      duration: meta.duration,
    };
    this.state.responses.push(response);
    this.persist();
    return response;
  }

  getResponses(surveyId: string): Response[] {
    return this.state.responses.filter((r) => r.surveyId === surveyId);
  }

  getAllResponses(): Response[] {
    return this.state.responses;
  }

  getResponsesByUser(userId: string): Response[] {
    return this.state.responses.filter((r) => r.userId === userId);
  }

  // === Демо-данные ===
  private async seedDemo() {
    if (this.state.users.length > 0) return;

    const adminSalt = generateSalt();
    const userSalt = generateSalt();
    const adminHash = await hashPassword('admin123', adminSalt);
    const userHash = await hashPassword('user123', userSalt);

    const admin: User = {
      id: uid(),
      name: 'Администратор',
      email: 'admin@survey.pro',
      passwordHash: adminHash,
      salt: adminSalt,
      role: 'admin',
      createdAt: Date.now(),
    };

    const user1: User = {
      id: uid(),
      name: 'Иван',
      email: 'user@survey.pro',
      passwordHash: userHash,
      salt: userSalt,
      role: 'user',
      createdAt: Date.now(),
    };

    this.state.users.push(admin, user1);

    const q1: Question = {
      id: uid(),
      type: 'single',
      text: 'Как часто вы пользуетесь продуктом?',
      required: true,
      options: ['Ежедневно', 'Несколько раз в неделю', 'Раз в неделю', 'Реже'],
    };
    const q2: Question = {
      id: uid(),
      type: 'rating',
      text: 'Оцените продукт по 5-балльной шкале',
      required: true,
      options: [],
    };
    const q3: Question = {
      id: uid(),
      type: 'single',
      text: 'Порекомендуете нас друзьям?',
      required: false,
      options: ['Обязательно', 'Скорее да', 'Не уверен', 'Скорее нет', 'Нет'],
    };
    const q4: Question = {
      id: uid(),
      type: 'text',
      text: 'Что бы вы улучшили?',
      required: false,
      options: [],
    };

    const surveyAdmin: Survey = {
      id: uid(),
      ownerId: admin.id,
      title: 'Удовлетворённость продуктом',
      description: 'Помогите нам стать лучше — 4 коротких вопроса',
      isPublic: true,
      published: true,
      questions: [q1, q2, q3, q4],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.state.surveys.push(surveyAdmin);

    const uq1: Question = {
      id: uid(),
      type: 'single',
      text: 'Любимый язык программирования?',
      required: true,
      options: ['JavaScript', 'Python', 'Java', 'C#'],
    };
    const uq2: Question = {
      id: uid(),
      type: 'rating',
      text: 'Оцените удобство нашего сайта',
      required: true,
      options: [],
    };

    const surveyUser: Survey = {
      id: uid(),
      ownerId: user1.id,
      title: 'Опрос разработчика',
      description: 'Короткий опрос про предпочтения в программировании',
      isPublic: false,
      published: true,
      questions: [uq1, uq2],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.state.surveys.push(surveyUser);

    // Демо-ответы
    const demoAnswers = [
      { [q1.id]: 0, [q2.id]: 5, [q3.id]: 0, [q4.id]: 'Всё отлично, спасибо!' },
      { [q1.id]: 1, [q2.id]: 4, [q3.id]: 1, [q4.id]: 'Добавьте тёмную тему' },
      { [q1.id]: 0, [q2.id]: 5, [q3.id]: 0, [q4.id]: '' },
      { [q1.id]: 2, [q2.id]: 3, [q3.id]: 2, [q4.id]: 'Больше интеграций' },
      { [q1.id]: 3, [q2.id]: 2, [q3.id]: 3, [q4.id]: 'Улучшить документацию' },
      { [q1.id]: 0, [q2.id]: 5, [q3.id]: 0, [q4.id]: 'Отличная работа!' },
      { [q1.id]: 1, [q2.id]: 4, [q3.id]: 1, [q4.id]: 'Хочу экспорт в PDF' },
      { [q1.id]: 0, [q2.id]: 5, [q3.id]: 0, [q4.id]: 'Всё нравится' },
    ];

    demoAnswers.forEach((ans, i) => {
      this.state.responses.push({
        id: uid(),
        surveyId: surveyAdmin.id,
        answers: ans as Record<string, string | number>,
        userId: admin.id,
        guest: null,
        createdAt: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
        duration: 30 + Math.floor(Math.random() * 120),
      });
    });

    this.state.responses.push({
      id: uid(),
      surveyId: surveyUser.id,
      answers: { [uq1.id]: 0, [uq2.id]: 5 } as Record<string, string | number>,
      userId: user1.id,
      guest: null,
      createdAt: Date.now(),
      duration: 45,
    });

    this.persist();
  }
}

export const dataStore = new DataStore();
