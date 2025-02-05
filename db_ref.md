generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String    @id @default(dbgenerated("substring(replace(cast(gen_random_uuid() as text), '-', ''), 1, 8)")) @db.Char(8)
  name      String?
  email     String    @unique
  image     String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  projects  Project[]
}

model Project {
  id          String           @id @default(dbgenerated("substring(replace(cast(gen_random_uuid() as text), '-', ''), 1, 8)")) @db.Char(8)
  name        String?
  description String?
  url         String?
  image       String?
  userId      String
  user        User             @relation(fields: [userId], references: [id])
  visitorSessions VisitorSession[]
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
}

model VisitorSession {
  id                String       @id @default(dbgenerated("substring(replace(cast(gen_random_uuid() as text), '-', ''), 1, 8)")) @db.Char(8)
  projectId         String
  project           Project      @relation(fields: [projectId], references: [id])
  visitorId         String       // Unique identifier for the visitor
  sessionStart      DateTime     @default(now()) // Start time of the session
  sessionEnd        DateTime?    // End time of the session (nullable)
  deviceInfoId      String
  deviceInfo        DeviceInfo   @relation(fields: [deviceInfoId], references: [id])
  browserInfoId     String
  browserInfo       BrowserInfo  @relation(fields: [browserInfoId], references: [id])
  visitedPages      String[]     // Array of visited pages
  isActive          Boolean      @default(false) // Whether the session is active
  isFinal           Boolean      @default(false) // Whether this is the final send
  source            String?      // Source of the traffic (e.g., social, search, direct)
  duration          Float?       // Duration of the session in seconds
  page              String?      // Current page of the session
  visitorEvents     VisitorEvent[]
  createdAt         DateTime     @default(now())
  updatedAt           DateTime     @updatedAt

  LocationInfo LocationInfo[]
}

model VisitorEvent {
  id                String       @id @default(dbgenerated("substring(replace(cast(gen_random_uuid() as text), '-', ''), 1, 8)")) @db.Char(8)
  visitorSessionId  String
  visitorSession    VisitorSession @relation(fields: [visitorSessionId], references: [id])
  eventType         String       // e.g., "pageview", "click", "form_submit"
  eventTimestamp    DateTime     @default(now()) // Timestamp of the event
  pageUrl           String?      // URL of the page where the event occurred
  duration          Int?         // Duration of the event (in seconds)
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt
}

model DeviceInfo {
  id                String       @id @default(dbgenerated("substring(replace(cast(gen_random_uuid() as text), '-', ''), 1, 8)")) @db.Char(8)
  deviceType        String?      // e.g., "desktop", "mobile", "tablet"
  deviceModel       String?      // e.g., "iPhone 12", "Samsung Galaxy S21"
  operatingSystem   String?      // e.g., "iOS", "Android", "Windows"
  visitorSessions   VisitorSession[]
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt
}

model BrowserInfo {
  id                String       @id @default(dbgenerated("substring(replace(cast(gen_random_uuid() as text), '-', ''), 1, 8)")) @db.Char(8)
  browserName       String?      // e.g., "Chrome", "Firefox", "Safari"
  browserVersion    String?      // e.g., "95.0.4638.69"
  visitorSessions   VisitorSession[]
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt
}

model LocationInfo {
  id                String       @id @default(dbgenerated("substring(replace(cast(gen_random_uuid() as text), '-', ''), 1, 8)")) @db.Char(8)
  country           String?      // e.g., "United States"
  region            String?      // e.g., "California"
  city              String?      // e.g., "San Francisco"
  timezone          String?      // e.g., "America/Los_Angeles"
  createdAt         DateTime     @default(now())
  visitorSessions   VisitorSession[]
  updatedAt         DateTime     @updatedAt
}