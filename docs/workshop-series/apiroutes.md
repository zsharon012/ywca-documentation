---
id: apiroutes
title: Backend API Routes
sidebar_position: 6
---

# Full API Endpoint Reference

## AUTH (/auth)

### `POST /auth/signup`

Create a new user.

**Auth:** Public

**Body**

```json
{
  "email": "string",
  "password": "string",
  "name": "string"
}
```

### `POST /auth/login`

Log in user.

**Auth:** Public

**Body**

```json
{
  "email": "string",
  "password": "string"
}
```

### `POST /auth/logout`

Log out user.

**Auth:** Required

### `GET /auth/me`

Get current authenticated user.

**Auth:** Required

### `GET /auth/profile`

Alias of `/auth/me`.

**Auth:** Required

### `GET /auth/users`

Get all users (admin intended).

**Auth:** Required (admin expected)

### `POST /auth/token`

Refresh token.

**Auth:** Depends on implementation

---

## CONTACTS (/contacts)

### `GET /contacts/recipients`

Get all recipients.

**Auth:** Required

### `GET /contacts/recipients-with-groups`

Get recipients with group data.

**Auth:** Required

### `POST /contacts/recipients`

Create recipient.

**Auth:** Required

**Body**

```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string"
}
```

### `GET /contacts/recipients/:recipientId`

Get recipient by ID.

**Auth:** Required

### `DELETE /contacts/recipients/:recipientId`

Delete recipient.

**Auth:** Required

### `GET /contacts/lists`

Get contact lists.

**Auth:** Required

### `POST /contacts/lists`

Create contact list.

**Auth:** Required

**Body**

```json
{
  "name": "string",
  "description": "string"
}
```

### `PUT /contacts/lists/:contactListId`

Update contact list.

**Auth:** Required

### `DELETE /contacts/lists/:contactListId`

Delete contact list.

**Auth:** Required

### `GET /contacts/lists/:listname`

Get list members.

**Auth:** Required

### `POST /contacts/members/add`

Add member to list.

**Auth:** Required

**Body**

```json
{
  "recipientId": "string",
  "contactlistID": "string"
}
```

### `PUT /contacts/members/:recipientId`

Update member.

**Auth:** Required

### `DELETE /contacts/lists/:contactGroupId/members/:recipientId`

Remove member.

**Auth:** Required

### `POST /contacts/bulk`

Bulk import recipients.

**Auth:** Required

**Body**

```json
{
  "contacts": [
    {
      "name": "string",
      "email": "string",
      "phone": "string"
    }
  ]
}
```

---

## MAIL OBJECTS (/mailobjects)

### `GET /mailobjects`

Get all mail objects.

**Auth:** Required

### `POST /mailobjects`

Create mail object.

**Auth:** Required

**Body**

```json
{
  "templateId": "string",
  "contactGroupId": "string"
}
```

### `GET /mailobjects/:mailobjectid`

Get mail object by ID.

**Auth:** Required

### `DELETE /mailobjects/:mailobjectid`

Delete mail object.

**Auth:** Required

---

## SCHEDULED SENDS (/scheduledsends)

### `GET /scheduledsends`

Get all scheduled sends.

**Auth:** Required

### `GET /scheduledsends/pending`

Get pending scheduled sends.

**Auth:** Required

### `POST /scheduledsends`

Create scheduled send.

**Auth:** Required

**Body**

```json
{
  "mailObjectId": "string",
  "sendDate": "date-time"
}
```

### `GET /scheduledsends/:mailobjectid`

Get scheduled send by ID.

**Auth:** Required

### `PUT /scheduledsends/:mailobjectid`

Update scheduled send.

**Auth:** Required

### `PATCH /scheduledsends/:mailobjectid/mark-sent`

Mark scheduled send as sent.

**Auth:** Required

### `DELETE /scheduledsends/:mailobjectid`

Delete scheduled send.

**Auth:** Required

---

## SEND MAIL (/sendmail)

### `POST /sendmail`

Send email immediately using a template.

**Auth:** Required

**Body**

```json
{
  "templateId": "string",
  "recipientIds": ["string"],
  "contactGroupIds": ["string"]
}
```

---

## SIGNUP LINKS (/signuplinks)

### `POST /signuplinks`

Generate signup link.

**Auth:** Required

**Body**

```json
{
  "expiryDate": "date-time"
}
```

### `GET /signuplinks/validate/:signuptoken`

Validate signup token.

**Auth:** Public

### `GET /signuplinks/:linkId`

Get signup link details.

**Auth:** Required

---

## TEMPLATES (/templates)

### `GET /templates`

Get all templates.

**Auth:** Required

### `POST /templates`

Create template.

**Auth:** Required

**Body**

```json
{
  "name": "string",
  "subject": "string",
  "body": "string"
}
```

### `GET /templates/:templateid`

Get template by ID.

**Auth:** Required

### `PUT /templates/:templateid`

Update template.

**Auth:** Required

### `DELETE /templates/:templateid`

Delete template.

**Auth:** Required

---

## SYSTEM

### `GET /health`

Health check.

**Auth:** Public

**Response**

```json
{
  "status": "ok"
}
```

---

## IMAGES (/images)

### `/images/*`

Image upload and retrieval routes.

**Auth:** Depends on implementation

---

## FLOW

```text
Templates → MailObjects → ScheduledSends / SendMail → Email Delivery
Contacts → Lists → Recipients
SignupLinks → Onboarding Flow
```

