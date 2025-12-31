# Sunain_Cloud_2
A personal cloud storage platform that supports secure uploads, downloads, and efficient storage using chunking and deduplication.
## System Architecture
This project follows a modular, service-oriented architecture designed to separate concerns 
such as authentication, metadata management, storage, and background processing.

![System Architecture](./Docs/architecture_color.png)

### Architecture Overview
- **Client (Web Browser)**  
  Handles user interaction and communicates exclusively with the API Gateway.

- **API Gateway**  
  Acts as a single entry point, responsible for JWT validation, request routing,
  and basic rate limiting.

- **Authentication Service**  
  Manages user login and token issuance. Stateless by design.

- **Upload Service**  
  Handles file uploads using fixed-size chunking, content hashing, compression,
  and deduplication before writing chunks to disk.

- **File Metadata Service**  
  Stores file structure, ownership, permissions, and chunk references in MongoDB.
  Serves as the source of truth for file visibility.

- **File Download Service**  
  Reconstructs files by streaming chunks from disk after validating access
  permissions via the metadata service.
  
- **Chunk Storage (Local Disk)**  
  Stores only raw chunk data. Contains no metadata or access logic.

### Design Principles

- Metadata is the source of truth; disk is treated as dumb storage.
- All access is mediated through authenticated services.
- Uploads follow a state-based lifecycle (INIT → UPLOADING → COMMITTED).
- Long-running or non-critical tasks are handled asynchronously.
