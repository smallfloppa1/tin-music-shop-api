# Dokumentacja Frontend - Sklep Muzyczny

To jest aplikacja frontendowa dla platformy e-commerce sklepu muzycznego, zbudowana przy użyciu nowoczesnych technologii webowych.

## Technologie i Biblioteki

Projekt wykorzystuje następujący stos technologiczny:

*   **Framework:** [React](https://react.dev/) (v19)
*   **Język:** [TypeScript](https://www.typescriptlang.org/)
*   **Budowanie (Build Tool):** [Vite](https://vitejs.dev/)
*   **Zarządzanie Stanem:** [Redux Toolkit](https://redux-toolkit.js.org/)
*   **Routing:** [React Router v6](https://reactrouter.com/)
*   **Komunikacja z API:** [Axios](https://axios-http.com/)
*   **Formularze i Walidacja:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
*   **Stylowanie:** [Tailwind CSS](https://tailwindcss.com/)

## Wymagania Wstępne

Przed uruchomieniem projektu upewnij się, że masz zainstalowane:

*   [Node.js](https://nodejs.org/) (wersja LTS zalecana)
*   npm (zazwyczaj instalowany razem z Node.js) lub yarn

## Instalacja i Uruchomienie

1.  **Pobierz repozytorium i wejdź do katalogu frontend:**
    ```bash
    cd frontend
    ```

2.  **Zainstaluj zależności:**
    ```bash
    npm install
    # lub
    yarn install
    ```

3.  **Uruchom serwer deweloperski:**
    ```bash
    npm run dev
    # lub
    yarn dev
    ```

4.  Otwórz przeglądarkę pod adresem wskazanym w terminalu (zazwyczaj `http://localhost:5173`).

## Konfiguracja Połączenia z Backendem

Aplikacja domyślnie oczekuje, że backend działa lokalnie na porcie `3000`.

### Proxy (Środowisko Deweloperskie)

Aby uniknąć problemów z CORS podczas developmentu, skonfigurowano proxy w pliku `vite.config.ts`. Wszystkie żądania zaczynające się od `/api` są przekierowywane do backendu.

**Plik:** `vite.config.ts`

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000', // Tutaj zmień adres backendu, jeśli jest inny
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
},
```

Jeśli Twój backend działa na innym adresie lub porcie, zaktualizuj pole `target` w powyższym pliku.

**Plik klienta API:** `src/api/axios.ts`
Klient Axios jest skonfigurowany tak, aby wysyłać żądania do `/api`, co pozwala mechanizmowi proxy Vite na ich przechwycenie i przekazanie.

## Struktura Projektu

```
src/
├── api/            # Konfiguracja Axios i interceptorów
├── components/     # Komponenty wielokrotnego użytku (np. Layout)
├── pages/          # Główne widoki aplikacji (strony)
│   ├── Cart.tsx          # Widok koszyka
│   ├── Categories.tsx    # Przeglądanie kategorii
│   ├── Home.tsx          # Strona główna
│   ├── Login.tsx         # Logowanie
│   ├── OrderDetails.tsx  # Szczegóły zamówienia
│   ├── Orders.tsx        # Historia zamówień
│   ├── ProductDetails.tsx# Szczegóły produktu
│   ├── ProductList.tsx   # Lista produktów w kategorii (z edycją dla admina)
│   ├── Profile.tsx       # Profil użytkownika (z edycją danych)
│   └── Register.tsx      # Rejestracja
├── store/          # Konfiguracja Redux (slices, store)
│   ├── authSlice.ts      # Stan autentykacji
│   └── cartSlice.ts      # Stan koszyka
├── types/          # Definicje typów TypeScript (DTO)
├── App.tsx         # Główny komponent i konfiguracja routingu
└── main.tsx        # Punkt wejścia aplikacji
```

## Główne Funkcjonalności

1.  **Autentykacja:**
    *   Logowanie i Rejestracja użytkowników.
    *   Przechowywanie tokena JWT w `localStorage`.
    *   Automatyczne wylogowanie po wygaśnięciu sesji (interceptor 401).

2.  **Produkty i Kategorie:**
    *   Przeglądanie drzewa kategorii (kategorie główne -> podkategorie).
    *   Wyświetlanie listy produktów w danej kategorii.
    *   Szczegółowy widok produktu.

3.  **Koszyk Zakupowy:**
    *   Dodawanie produktów do koszyka.
    *   Podgląd zawartości koszyka.
    *   Usuwanie pojedynczych pozycji lub czyszczenie całego koszyka.
    *   Składanie zamówienia ("Place Order").

4.  **Zamówienia:**
    *   Historia zamówień zalogowanego użytkownika.
    *   Szczegóły konkretnego zamówienia (status, produkty, kwota).

5.  **Profil Użytkownika:**
    *   Podgląd danych osobowych.
    *   Edycja danych (Imię, Nazwisko, Email).

6.  **Panel Administratora (Role-Based):**
    *   Użytkownicy z rolą `ADMIN` widzą przycisk edycji na kartach produktów.
    *   Możliwość edycji nazwy, opisu, ceny, stanu magazynowego i zdjęcia produktu bezpośrednio z listy.
