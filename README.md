<img src="frontend/public/logo/README.png" width="80"/>

# AutoML Studio

**AutoML Studio** is a powerful No-Code Machine Learning Platform that empowers users to build, train, and evaluate machine learning models using an intuitive drag-and-drop interface. Whether you are a data scientist or a beginner, AutoML Studio streamlines the complex process of ML workflows into simple, visual steps.

![AutoML Studio Workflow](https://drive.google.com/uc?export=view&id=1E03bhi8-yiE4zCh7Gt4stW_t7J3y2J1t)

## Key Features

- **Visual Workflow Builder**: Create complex ML pipelines by dragging and dropping nodes (powered by `@xyflow/react`).
- **No-Code Interface**: Perform data preprocessing, cleaning, and model training without writing a single line of code.
- **Multi-Backend Architecture**: Robust microservices architecture for scalability and performance.
- **Real-time Analysis**: Interactive data visualization and analysis tools.
- **Secure Authentication**: Integrated user management and authentication system.

---

## System Architecture

The project follows a microservices architecture to ensure modularity and scalability.

```mermaid
graph TD
    Client["Frontend (Next.js)"]
    Node["Node Backend (Express)"]
    Ops["Operations Backend (FastAPI)"]
    DB[("MongoDB")]
    Redis[("Redis")]

    Client -->|API REST/WebSocket| Node
    Client -->|Direct Upload/Ops| Ops
    Node -->|Auth & Metadata| DB
    Node -->|Data Mgmt| Ops
    Ops -->|Data Processing| DB

    subgraph Services
        Node
        Ops
    end
```

### Components

1.  **Frontend (`/frontend`)**:

    - **Tech Stack**: Next.js 16, React 19, Redux Toolkit, Tailwind CSS.
    - **Role**: The user interface for designing workflows and managing datasets. Features the drag-and-drop canvas.

2.  **Primary Backend (`/primary-backend`)**:

    - **Tech Stack**: Express.js, TypeScript, Mongoose.
    - **Role**: Acts as the primary API gateway. Handles user authentication, project management, and orchestration between services.

3.  **Operations Backend (`/operations-backend`)**:
    - **Tech Stack**: FastAPI.
    - **Role**: Dedicated service for high-throughput data operations, dataset processing, and file management.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.10+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- [Redis](https://redis.io/) (For task queues)

### Installation & Setup

#### 1. Frontend

The frontend is built with Next.js and runs on port `5173` by default.

```bash
cd frontend

npm install

npm run dev
```

#### 2. Node Backend

The primary backend handles API requests, authentication, and workflow manaagement. It runs on port `3000`.

```bash
cd primary-backend

npm install

npm run dev
```

#### 3. Operations Backend

The operations backend is a FastAPI service for data-intensive tasks.

```bash
cd operations-backend

python -m venv venv

.\venv\Scripts\activate
or
source venv/bin/activate

pip install -r requirements.txt

python run.py
```

---

## Workflow Example

Here is a visual representation of a typical machine learning workflow you can build in AutoML Studio:

```mermaid
graph LR
    input((Dataset))
    split[Data Splitter]
    train[Model Training]
    eval[Evaluation]
    deploy[Deployment]

    input --> split
    split -->|Training Set| train
    split -->|Test Set| eval
    train -->|Model| eval
    eval -->|Metrics Verification| deploy

    style input fill:#f9f,stroke:#333
    style train fill:#bbf,stroke:#333
    style deploy fill:#dfd,stroke:#333
```

## Development

- **Frontend**: Built with Next.js App Router. Workflows are managed using React Flow (xyflow).
- **Backend Communication**: Services communicate via REST APIs. Long-running ML tasks are offloaded to background workers via Redis queues.

## Contributing

We welcome contributions to AutoML Studio! Whether you're fixing a bug, adding a new feature, or improving documentation, we appreciate your help.

### How to Contribute

1.  **Fork the Repository**: Click the "Fork" button at the top right of this page to create your own copy of the repository.
2.  **Clone the Repository**:
    ```bash
    git clone https://github.com/your-username/AutoML-Studio.git
    cd AutoML-Studio
    ```
3.  **Create a Branch**:
    ```bash
    git checkout -b feature/your-feature-name
    ```
4.  **Make Changes**: Implement your changes and ensure everything is working as expected.
5.  **Commit Changes**:
    ```bash
    git add .
    git commit -m "feat: Add your feature description"
    ```
6.  **Push to Your Fork**:
    ```bash
    git push origin feature/your-feature-name
    ```
7.  **Create a Pull Request**: Go to the original repository on GitHub and open a Pull Request from your forked branch.

### Guidelines

- Please follow the existing code style.
- Ensure that you have tested your changes locally.
- Provide a clear description of your changes in the Pull Request.

---

Made with ❤️ by [Udaykumar Dhokia](https://github.com/udaykumar-dhokia) using Next.js, TypeScript & Python.
