# Kevinbotelhodossantomachado055746 – SEPLAG Frontend

Aplicação frontend desenvolvida em **Angular** para gerenciamento de **Pets** e **Tutores**, com recursos de autenticação, paginação, filtros, alertas, detecção de conectividade e containerização com Docker.

---

## Tecnologias Utilizadas

* **Angular** (Standalone Components)
* **TypeScript**
* **RxJS**
* **TailwindCSS**
* **Docker & Docker Compose**
* **Nginx** (produção)

---

## Funcionalidades

### Autenticação

* Login com token armazenado no `localStorage`
* Logout com limpeza de sessão
* Proteção de rotas via `AuthGuard`
* Interceptor HTTP para anexar token e tratar erros `401`

### Pets

* Listagem paginada
* Filtro por nome
* Criação e edição de pets
* Visualização de detalhes

### Tutores

* Listagem de tutores
* Criação e edição
* Associação de pets ao tutor
* Máscaras de CPF e telefone

### UX / Estado

* Componente reutilizável de paginação
* Alertas de sucesso, aviso e erro

---

##  Health Check (Frontend)

Como o backend **não possui rota de health check**, a aplicação realiza a verificação de conectividade no frontend:

* Detecção de ausência de internet (`navigator.onLine`)
* Tratamento de erro de conexão (`HttpErrorResponse` com status 0)
* Exibição de alerta quando offline
* Remoção automática do alerta quando a conexão é restabelecida

---

## 🛠 Desenvolvimento

### Servidor de desenvolvimento

Para iniciar o servidor local:

```bash
ng serve
```

Acesse `http://localhost:4200/`. O projeto recarrega automaticamente sempre que você modificar os arquivos.

### Build do projeto

Para gerar uma build de produção:

```bash
ng build
```

Os arquivos serão compilados em `dist/` com otimizações de performance e tamanho.

### Testes unitários

Execute os testes com [Vitest](https://vitest.dev/):

```bash
ng test
```

---

##  Containerização

### Build e execução com Docker

```bash
docker compose up --build
```

A aplicação será iniciada em containers, pronta para desenvolvimento ou produção.
