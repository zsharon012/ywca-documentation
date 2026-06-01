---
id: databaseschema
title: Backend Database Schema
sidebar_position: 7
---

# Database Schema Overview

## Overview

This database supports an email campaign and contact management system. Users can create and manage recipient lists, design reusable email templates, schedule email sends, and generate signup links for onboarding additional users.

The schema is organized around four primary domains:

1. **User Management** – Application users and signup workflows.
2. **Contact Management** – Recipients and recipient groups.
3. **Template Management** – Reusable email templates.
4. **Mail Scheduling & Delivery** – Scheduled email sends targeting either individual recipients or contact groups.

---

## Schema Diagram

> Insert database schema image here.
![alt text](<Screenshot 2026-06-01 084405.png>)


---

## Core Entities

### Users

The `users` table stores authenticated application users. Each user is linked to a unique Firebase account and may own:

* Contact lists
* Email templates
* Signup links

**Key relationships:**

* One user can create many contact lists.
* One user can create many templates.
* One user can generate many signup links.

---

### Recipients

The `recipients` table stores contact information for email recipients.

Each recipient contains:

* First name
* Last name
* Email address
* Optional phone number

Recipients are independent entities and can belong to multiple contact lists.

---

### Contact Lists

The `contactlists` table represents named groups of recipients.

Examples:

* Engineering Team
* Alumni Mailing List
* Event Attendees

Each contact list:

* Has a name and description
* Belongs to a user
* Contains multiple recipients

The many-to-many relationship between contact lists and recipients is implemented through the `contactlists_users` junction table.

---

### Contact List Membership

The `contactlists_users` table connects recipients to contact lists.

This enables:

* One recipient to belong to multiple contact lists
* One contact list to contain multiple recipients

This table contains only relationship data and uses a composite primary key to prevent duplicate memberships.

---

## Email Templates

The `templates` table stores reusable email content.

Each template includes:

* Name
* Subject
* Body
* Creation timestamp
* Optional edit timestamp
* Creator information

Templates are designed to be reused across multiple mail campaigns.

---

## Mail Objects

The `mailobject` table represents a specific email campaign instance.

A mail object combines:

* One template
* One target audience

The target audience can be either:

* A contact list (`contactgroupid`)
* An individual recipient (`recipientid`)

A database constraint ensures that exactly one targeting method is used for each mail object.

This design provides flexibility while maintaining data integrity.

---

## Scheduled Sends

The `scheduledsends` table controls when mail objects are sent.

Each scheduled send contains:

* A mail object
* A scheduled send date/time
* A sent status flag

A one-to-one relationship exists between a scheduled send and its corresponding mail object.

This separation allows mail configuration and scheduling logic to remain independent.

---

## Signup Links

The `signuplinks` table manages user onboarding and invitation workflows.

Each signup link contains:

* A unique signup token
* Expiration date
* Creating user

Signup links are deleted automatically if the creating user is removed.

---

## Relationship Summary

### User Relationships

* `users` → `contactlists` (1:N)
* `users` → `templates` (1:N)
* `users` → `signuplinks` (1:N)

### Contact Management Relationships

* `contactlists` ↔ `recipients` (M:N through `contactlists_users`)

### Email Relationships

* `templates` → `mailobject` (1:N)
* `contactlists` → `mailobject` (1:N)
* `recipients` → `mailobject` (1:N target option)
* `mailobject` → `scheduledsends` (1:1)

---

## Design Highlights

### Flexible Recipient Targeting

Emails can be sent to either:

* An entire contact list
* A single recipient

The database enforces that only one targeting method is used per mail object.

### Template Reusability

Templates are separated from scheduled sends, allowing the same content to be reused across multiple campaigns.

### Referential Integrity

Foreign key constraints and cascading deletes ensure that dependent records are automatically cleaned up when parent entities are removed.

### Scalable Contact Organization

The many-to-many contact list structure allows recipients to participate in multiple mailing groups without duplicating recipient records.
