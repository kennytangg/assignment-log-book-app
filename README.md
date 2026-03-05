# Assignment Log API

## Data Model

`Assignment`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | `string` | Yes | Generated with `crypto.randomUUID()` on create |
| `title` | `string` | Yes | |
| `subject` | `string` | Yes | |
| `description` | `string` | Yes | |
| `dueDate` | `string` | Yes | Date string |
| `status` | `"pending" \| "completed" \| "overdue"` | Yes | Default to `"pending"` |
| `createdAt` | `string` | Yes | ISO timestamp on create |

## API Design Table

| Endpoint | Method | API Endpoint Description | Scenario | Requirement | Expected Output | Actual Output | Test Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/api/assignments` | `GET` | List all assignments | Success | None | Status: 200, `{ success: true, data: Assignment[] }` | Returns current in-memory array as-is | Passed |
| **Evidence:** | | | | | ![](public/api_get_all.png) | | |
| `/api/assignments` | `GET` | List all assignments | Error | Server failure | Status: 500, `{ success: false, message: "Failed to fetch assignments" }` | Wrapped in try-catch | Passed |
| **Evidence:** | | | | | ![](public/api_get_error.png) | | |
| `/api/assignments` | `POST` | Create new assignment | Success | `title`, `subject`, `description`, `dueDate` provided | Status: 201, `{ success: true, data: Assignment }` with generated `id` and `createdAt` | Generates UUID for `id`, ISO timestamp for `createdAt`, defaults `status` to `"pending"` | Passed |
| **Evidence:** | | | | | ![](public/api_post.png) | | |
| `/api/assignments` | `POST` | Create new assignment | Error | Missing required field (e.g., `title`) | Status: 400, `{ success: false, message: "title, subject, description, and dueDate are required" }` | Validates all four required fields | Passed |
| **Evidence:** | | | | | ![](public/api_post_error.png) | | |
| `/api/assignments` | `POST` | Create new assignment | Error | Server failure | Status: 500, `{ success: false, message: "Failed to create assignment" }` | Wrapped in try-catch | Passed |
| `/api/assignments/{id}` | `GET` | Fetch assignment by ID | Success | Valid `id` exists | Status: 200, `{ success: true, data: Assignment }` | Exact match lookup on `Assignment.id` | Passed |
| **Evidence:** | | | | | ![](public/api_get_id.png) | | |
| `/api/assignments/{id}` | `GET` | Fetch assignment by ID | Error | Assignment not found | Status: 404, `{ success: false, message: "Assignment not found" }` | Returns 404 when `id` not in array | Passed |
| **Evidence:** | | | | | ![](public/api_get_error.png) | | |
| `/api/assignments/{id}` | `GET` | Fetch assignment by ID | Error | Server failure | Status: 500, `{ success: false, message: "Failed to fetch assignment" }` | Wrapped in try-catch | Passed |
| `/api/assignments/{id}` | `PUT` | Update assignment (partial merge) | Success | Valid `id` and partial body | Status: 200, `{ success: true, data: Assignment }` | Merges body with `{ ...existing, ...body }` | Passed |
| **Evidence:** | | | | | ![](public/api_put_id.png) | | |
| `/api/assignments/{id}` | `PUT` | Update assignment (partial merge) | Error | Assignment not found | Status: 404, `{ success: false, message: "Assignment not found" }` | Returns 404 when `id` not in array | Passed |
| **Evidence:** | | | | | ![](public/api_put_error.png) | | |
| `/api/assignments/{id}` | `PUT` | Update assignment (partial merge) | Error | Server failure | Status: 500, `{ success: false, message: "Failed to update assignment" }` | Wrapped in try-catch | Passed |
| `/api/assignments/{id}` | `DELETE` | Delete assignment | Success | Valid `id` exists | Status: 200, `{ success: true, message: "Assignment deleted", data: Assignment }` | Removes element via `splice`, returns deleted record | Passed |
| **Evidence:** | | | | | ![](public/api_delete_id.png) | | |
| `/api/assignments/{id}` | `DELETE` | Delete assignment | Error | Assignment not found | Status: 404, `{ success: false, message: "Assignment not found" }` | Returns 404 when `id` not in array | Passed |
| **Evidence:** | | | | | ![](public/api_delete_error.png) | | |
| `/api/assignments/{id}` | `DELETE` | Delete assignment | Error | Server failure | Status: 500, `{ success: false, message: "Failed to update assignment" }` | Wrapped in try-catch | Passed |