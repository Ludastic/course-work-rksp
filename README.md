# ReviewHub - Портал отзывов с элементами социального взаимодействия
## Автор: Титлянов А.К. ИКБО-20-22


## Технологии
- Java
- SpringBoot
- JavaScript
- ReactJS

## Требования
- Java 17
- Docker и Docker Compose
- PostgreSQL 15+

## Установка и запуск

### 1. Клонирование репозитория
```bash
git clone https://github.com/Ludastic/course-work-rksp.git
cd course-work-rksp
```



### 3. Запуск с помощью Docker
```bash
cd project
docker run -d
cd ../course-work-rskp-backend
docker run -d
```

## API Endpoints

### Сервис пользователей (`/api/auth`)
- `POST /api/auth/login` - Аутентификация пользователя (логин)
- `POST /api/auth/register` - Регистрация нового пользователя
- `POST /api/auth/logout` - Выход из системы (логаут)

### Сервис отзывов (`/api/reviews`)
- `GET /api/reviews` - Получение списка всех отзывов
- `POST /api/reviews` - Создание нового отзыва
- `PUT /api/reviews/{id}` - Обновление существующего отзыва
- `DELETE /api/reviews/{id}` - Удаление отзыва
- `POST /api/reviews/{reviewId}/vote` - Голосование за отзыв (лайк/дизлайк)

## Тестирование

### Запуск всех тестов
```bash
gradle test
```


## Структура проекта
```
course-work-rksp/
│
├───backend/               # Backend часть проекта (Spring Boot)
│   ├───src/
│   │   ├───main/
│   │   │   ├───java/      # Исходный код Java
│   │   │   │   └───course/backend/
│   │   │   │       ├───configurations/  # Конфигурации Spring
│   │   │   │       ├───controllers/     # API контроллеры
│   │   │   │       ├───DTOs/            # Data Transfer Objects
│   │   │   │       ├───entities/        # Сущности БД
│   │   │   │       ├───repositories/    # JPA репозитории
│   │   │   │       └───services/        # Бизнес-логика
│   │   │   └───resources/ # Ресурсы
│   │   │       ├───static/  # Статические файлы
│   │   │       └───templates/ # Шаблоны
│   │   └───test/        # Тесты
│   │       └───java/
│   │           └───course/backend/
│   └───build.gradle     # Файл сборки Gradle
│
└───project/             # Frontend часть проекта
    ├───src/
    │   ├───components/  # React компоненты
    │   ├───context/     # Контексты React
    │   ├───layouts/     # Макеты страниц
    │   ├───pages/       # Страницы приложения
    │   ├───services/    # API клиенты
    │   └───types/       # Типы TypeScript
    └───package.json     # Зависимости frontend

```
