---
sidebar_position: 1
slug: /
---

# YWCA Email Tracker Documentation

This documentation describes the YWCA Email Tracker application, a full-stack communication system for managing community outreach, email templates, contact groups, and scheduled sends.

## What this system does

The application provides a dashboard for the YWCA team to:

- manage an aggregated contact list of parents and guardians
- create, edit, and save email templates
- schedule email campaigns to contact groups or distribution lists
- track send status and review historical sends
- authenticate users with Firebase and secure backend APIs

## Why this project exists

YWCA outreach teams were manually sending email communications to families and tracking mailing lists in spreadsheets. That process is time-consuming and hard to scale. The YWCA Email Tracker replaces that workflow with:

- a centralized contact and group management interface
- reusable email templates with rich text editing
- scheduled email delivery to targeted recipient groups
- a backend API that verifies Firebase-authenticated users and stores send data safely

## Key user scenarios

### Scenario 1: Monitor outreach from the dashboard
A program coordinator opens the dashboard, checks how many sends are pending, and reviews the latest scheduled messages. They use the calendar and summary cards to understand timing and volume.

### Scenario 2: Build a reusable email template
A coordinator creates a new template in the Templates page, adds placeholders and images, and saves it for reuse in future campaigns.

### Scenario 3: Organize contacts and send to groups
A staff member imports or adds contacts, organizes them into groups, and schedules a message to go out to the right audience before an event.

## System boundaries

This documentation covers the YWCA project implementation in two repositories:

- `ywca/ywca-frontend` — React frontend application built with Vite and Firebase authentication
- `ywca/ywca-backend` — Express.js backend with SQL database connectivity, Swagger API docs, and scheduled send processing

It does not cover third-party environment provisioning such as Firebase project creation, Supabase account setup, or production cloud deployment configurations.
 