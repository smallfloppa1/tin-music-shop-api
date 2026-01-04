# Dokumentacja API Sklepu Muzycznego

## Wstęp
Ten dokument opisuje backend aplikacji sklepu muzycznego zbudowany przy użyciu frameworka NestJS. Aplikacja zapewnia funkcjonalności takie jak uwierzytelnianie użytkowników, zarządzanie produktami i kategoriami, obsługa koszyka zakupowego oraz składanie zamówień.

## Technologie i Biblioteki

### Framework
- **NestJS (@nestjs/core, @nestjs/common)**: Progresywny framework Node.js do budowania wydajnych i skalowalnych aplikacji serwerowych. Wykorzystuje TypeScript i czerpie inspirację z Angulara (Dependency Injection, Moduły, Dekoratory).

### Baza Danych
- **MySQL (mysql2)**: Relacyjna baza danych wykorzystywana do przechowywania informacji o użytkownikach, produktach, zamówieniach itp.
- **TypeORM (@nestjs/typeorm, typeorm)**: ORM (Object-Relational Mapper) dla TypeScript i JavaScript. Umożliwia interakcję z bazą danych za pomocą obiektów i klas, zamiast surowego SQL.
- **typeorm-naming-strategies**: Biblioteka pomocnicza do definiowania strategii nazewnictwa kolumn i tabel (np. snake_case w bazie danych vs camelCase w kodzie).

### Uwierzytelnianie i Bezpieczeństwo
- **JWT (@nestjs/jwt)**: Implementacja JSON Web Tokens do bezstanowego uwierzytelniania użytkowników.
- **Bcrypt (bcrypt)**: Biblioteka do bezpiecznego haszowania haseł użytkowników przed zapisaniem ich w bazie danych.

### Walidacja i Transformacja Danych
- **class-validator**: Biblioteka do walidacji obiektów przy użyciu dekoratorów (np. sprawdzanie czy pole jest emailem, czy jest wymagane).
- **class-transformer**: Umożliwia transformację zwykłych obiektów JavaScript na instancje klas oraz serializację/deserializację danych.

### Narzędzia Deweloperskie
- **TypeScript**: Nadzbiór JavaScript dodający statyczne typowanie.
- **ESLint & Prettier**: Narzędzia do statycznej analizy kodu i formatowania, zapewniające spójność stylu kodu.
- **Jest**: Framework do testowania aplikacji.

## Struktura Projektu

Projekt jest zorganizowany w oparciu o moduły, co jest standardem w NestJS. Główny katalog to `src/`.

```
src/
├── migrations/          # Pliki migracji bazy danych (tworzenie tabel, seedowanie danych)
├── modules/             # Logika biznesowa podzielona na domeny
│   ├── auth/            # Uwierzytelnianie (logowanie, rejestracja, strażnicy)
│   ├── cart/            # Obsługa koszyka zakupowego
│   ├── order/           # Obsługa zamówień
│   ├── payment/         # (Placeholder) Moduł płatności
│   ├── product/         # Zarządzanie produktami
│   ├── product-category/# Zarządzanie kategoriami produktów
│   └── user/            # Zarządzanie użytkownikami
├── app.module.ts        # Główny moduł aplikacji, importujący inne moduły
├── main.ts              # Punkt wejścia aplikacji (bootstrap)
└── typeorm.config.ts    # Konfiguracja połączenia z bazą danych
```

## Wykaz Zaimplementowanej Funkcjonalności i Kontrola Dostępu

Poniżej znajduje się lista funkcjonalności API wraz z wymaganiami dotyczącymi dostępu.

### 1. Auth (Uwierzytelnianie)
- **Rejestracja użytkownika** (`POST /auth/register`): Publiczny dostęp.
- **Logowanie użytkownika** (`POST /auth/login`): Publiczny dostęp.

### 2. User (Użytkownik)
- **Pobranie danych zalogowanego użytkownika** (`GET /user/me`): Wymaga zalogowanego użytkownika (dowolna rola).
- **Aktualizacja danych zalogowanego użytkownika** (`PATCH /user/me`): Wymaga zalogowanego użytkownika (dowolna rola).
- **Pobranie danych użytkownika po ID** (`GET /user/:id`): Wymaga zalogowanego użytkownika (dowolna rola).
- **Aktualizacja danych użytkownika po ID** (`PATCH /user/:id`): Wymaga zalogowanego użytkownika (dowolna rola).
- **Usunięcie użytkownika** (`DELETE /user/:id`): Wymaga roli **ADMIN**.

### 3. Product (Produkty)
- **Pobranie szczegółów produktu** (`GET /product/:id`): Publiczny dostęp.
- **Pobranie produktów z kategorii** (`GET /product/category/:categoryName`): Publiczny dostęp.
- **Dodanie produktu** (`POST /product`): Wymaga roli **ADMIN**.
- **Aktualizacja produktu** (`PATCH /product/:id`): Wymaga roli **ADMIN**.
- **Usunięcie produktu** (`DELETE /product/:id`): Wymaga roli **ADMIN**.

### 4. Product Category (Kategorie Produktów)
- **Pobranie wszystkich kategorii** (`GET /product-category`): Publiczny dostęp.
- **Utworzenie kategorii** (`POST /product-category`): Wymaga roli **ADMIN**.
- **Aktualizacja kategorii** (`PATCH /product-category/:id`): Wymaga roli **ADMIN**.
- **Usunięcie kategorii** (`DELETE /product-category/:id`): Wymaga roli **ADMIN**.

### 5. Cart (Koszyk)
- **Pobranie koszyka** (`GET /cart`): Wymaga zalogowanego użytkownika (dowolna rola).
- **Dodanie do koszyka** (`POST /cart`): Wymaga zalogowanego użytkownika (dowolna rola).
- **Usunięcie z koszyka** (`DELETE /cart/:itemId`): Wymaga zalogowanego użytkownika (dowolna rola).
- **Wyczyszczenie koszyka** (`DELETE /cart`): Wymaga zalogowanego użytkownika (dowolna rola).

### 6. Order (Zamówienia)
- **Złożenie zamówienia** (`POST /order`): Wymaga zalogowanego użytkownika (dowolna rola).
- **Pobranie historii zamówień** (`GET /order`): Wymaga zalogowanego użytkownika (dowolna rola).
- **Pobranie szczegółów zamówienia** (`GET /order/:id`): Wymaga zalogowanego użytkownika (dowolna rola).

## Uruchomienie Aplikacji

Aby uruchomić aplikację, należy wykonać następujące kroki:

1.  **Wymagania wstępne**:
    *   Zainstalowane środowisko **Node.js** (wersja 16 lub nowsza).
    *   Działająca baza danych **MySQL** (wersja 8.0 lub kompatybilna).

2.  **Instalacja zależności**:
    Otwórz terminal w katalogu głównym projektu i wykonaj polecenie:
    ```bash
    npm install
    ```

3.  **Konfiguracja środowiska**:
    Utwórz plik `.env` w katalogu głównym projektu i uzupełnij go o następujące zmienne konfiguracyjne (dostosuj wartości do swojej bazy danych):
    ```env
    DB_HOST=localhost
    DB_PORT=3306
    DB_USERNAME=root
    DB_PASSWORD=twoje_haslo
    DB_DATABASE=tin_music_shop
    JWT_SECRET=bardzo_tajny_sekret_jwt
    PORT=3000
    ```

4.  **Migracja bazy danych**:
    Aplikacja wykorzystuje migracje do utworzenia struktury tabel oraz załadowania danych początkowych (seed). Uruchom polecenie:
    ```bash
    npm run migration:run
    ```
    *To polecenie utworzy tabele `user`, `product`, `product_category`, `cart`, `order` itd. oraz doda przykładowych użytkowników (admin, user) i produkty.*

5.  **Uruchomienie serwera**:
    Aby uruchomić aplikację w trybie deweloperskim (z automatycznym przeładowaniem po zmianach):
    ```bash
    npm run start:dev
    ```
    Aplikacja będzie dostępna pod adresem `http://localhost:3000`.

6.  **Dokumentacja API (Swagger)**:
    Po uruchomieniu aplikacji, pełna dokumentacja endpointów w formacie Swagger UI jest dostępna pod adresem:
    `http://localhost:3000/api`
