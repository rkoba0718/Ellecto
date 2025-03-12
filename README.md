# Ellecto

## Overview

Ellecto is a tool designed to support both software developers and users in the selection of open-source software (OSS).
It offers a robust search system based on OSS functionalities, enabling users to access detailed information about development languages, licenses, dependencies, development history, and similar projects, among others.

Refer to the [documentation](./docs/document.pdf) for instructions on use..

## Functions

### Search

<img width="50%" alt="スクリーンショット 2025-03-12 18 01 20" src="https://github.com/user-attachments/assets/3b79253c-c963-4f72-a7aa-286980cf537d" />

You can search for software using five detailed options.

### Search Results

<img width="50%" alt="スクリーンショット 2025-03-12 18 01 34" src="https://github.com/user-attachments/assets/2452f46e-4cf6-4543-8500-a4260efe8aa8" />

The search results provide an overview of the basic features of the software you are looking for.

### Project Details

<img width="50%" alt="スクリーンショット 2025-01-17 9 58 56" src="https://github.com/user-attachments/assets/46df9aaa-e2db-45f5-b925-c0339d0a8169" />

In the project detail screen, you can view various information about the software.

## How to Set Up the Local Environment

### Creating the `.env` File

To run Ellecto in a local environment, set the following variables in the `.env` file.

`.env`

|Variable Name|Value|
|----|----|
|DB_USER|root|
|DB_PASSWORD|YOUR_DB_PASSWORD|

`visualize-tool/.env`

|Variable Name|Value|
|----|----|
|DB_URL|YOUR_MONGODB_URL|
|DB_NAME|YOUR_DB_NAME|
|PROJECT_COLLECTION_NAME|YOUR_PROJECT_DATA_COLLECTION_NAME|
|SIMILARITY_COLLECTION_NAME|YOUR_SIMILARITY_DATA_COLLECTION_NAME|
|GITHUB_TOKEN|YOUR_GITHUB_API_TOKEN|

### Starting the Server

Run the following commands:

```
docker-compose build
docker-compose up -d
```
