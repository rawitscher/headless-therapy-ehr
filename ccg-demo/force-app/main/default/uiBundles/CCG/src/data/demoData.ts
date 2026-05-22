export type Patient = {
  id: string;
  slug: string;
  name: string;
  preferredName?: string;
  dob: string;
  age: number;
  pronouns: string;
  status: 'Active' | 'New' | 'Inactive' | 'Waitlist';
  primaryClinician: string;
  primaryClinicianId: string;
  diagnosis: string[];
  paymentType: 'Cash-pay' | 'Insurance';
  phone: string;
  email: string;
  address: string;
  nextAppointment?: string;
  lastAppointment?: string;
  lastPortalLogin?: string;
  outstandingBalance?: number;
  riskLevel?: 'Low' | 'Medium' | 'High';
  initials: string;
  salesforceContactId?: string;
};

// Salesforce CRM record IDs — replace with your own org's URL + IDs after deploy.
// To regenerate: run `sf org display --target-org <alias> --json` and update.
export const SALESFORCE_INSTANCE_URL =
  'https://YOUR-ORG-my-domain.my.salesforce.com';
export const CCG_ACCOUNT_ID = '001000000000000AAA';

export type Appointment = {
  id: string;
  patientId: string;
  patientName: string;
  clinician: string;
  type: string;
  start: string; // ISO
  durationMin: number;
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'No-show' | 'Cancelled';
  location: 'Telehealth' | 'In-person';
  notesStatus?: 'Pending' | 'Draft' | 'Complete' | 'AI Drafted';
};

export type Note = {
  id: string;
  patientId: string;
  date: string;
  clinician: string;
  type: 'Intake' | 'Progress' | 'Treatment Plan' | 'Discharge';
  summary: string;
  status: 'Signed' | 'Draft' | 'AI Drafted';
};

export type Message = {
  id: string;
  patientId?: string;
  patientName?: string;
  preview: string;
  timestamp: string;
  unread: boolean;
  channel: 'Portal' | 'SMS' | 'Email';
};

export type BillingItem = {
  id: string;
  patientId: string;
  date: string;
  description: string;
  amount: number;
  status: 'Paid' | 'Outstanding' | 'Refunded';
};

export const currentUser = {
  name: 'Dr. Emily Chen',
  role: 'Clinical Psychologist',
  initials: 'EC',
  avatarColor: '#2c7da0',
};

export const patients: Patient[] = [
  {
    id: 'p1',
    slug: 'sarah-mitchell',
    name: 'Sarah Mitchell',
    preferredName: 'Sarah',
    dob: '1991-03-14',
    age: 34,
    pronouns: 'she/her',
    status: 'Active',
    primaryClinician: 'Dr. Emily Chen',
    primaryClinicianId: 'u1',
    diagnosis: ['Generalized Anxiety Disorder', 'Major Depressive Disorder, recurrent'],
    paymentType: 'Cash-pay',
    phone: '(212) 555-0142',
    email: 'sarah.mitchell@example.com',
    address: '142 W 78th St, New York, NY 10024',
    nextAppointment: '2026-05-26T14:00:00',
    lastAppointment: '2026-05-05T14:00:00',
    lastPortalLogin: '2026-05-03T09:24:00',
    outstandingBalance: 175,
    riskLevel: 'Medium',
    initials: 'SM',
    salesforceContactId: '003Bi00000OPRbtIAH',
  },
  {
    id: 'p2',
    slug: 'marcus-johnson',
    name: 'Marcus Johnson',
    dob: '1985-11-02',
    age: 40,
    pronouns: 'he/him',
    status: 'Active',
    primaryClinician: 'Dr. Emily Chen',
    primaryClinicianId: 'u1',
    diagnosis: ['Adjustment Disorder'],
    paymentType: 'Cash-pay',
    phone: '(917) 555-0188',
    email: 'mjohnson@example.com',
    address: 'Brooklyn, NY',
    nextAppointment: '2026-05-22T10:00:00',
    lastAppointment: '2026-05-15T10:00:00',
    outstandingBalance: 0,
    riskLevel: 'Low',
    initials: 'MJ',
    salesforceContactId: '003Bi00000OPRbuIAH',
  },
  {
    id: 'p3',
    slug: 'priya-shah',
    name: 'Priya Shah',
    dob: '1996-07-21',
    age: 29,
    pronouns: 'she/her',
    status: 'Active',
    primaryClinician: 'Dr. David Park',
    primaryClinicianId: 'u2',
    diagnosis: ['Panic Disorder'],
    paymentType: 'Cash-pay',
    phone: '(646) 555-0102',
    email: 'priya.s@example.com',
    address: 'Manhattan, NY',
    nextAppointment: '2026-05-22T15:30:00',
    lastAppointment: '2026-05-15T15:30:00',
    outstandingBalance: 0,
    riskLevel: 'Low',
    initials: 'PS',
    salesforceContactId: '003Bi00000OPRbvIAH',
  },
  {
    id: 'p4',
    slug: 'james-okafor',
    name: 'James Okafor',
    dob: '1978-01-09',
    age: 47,
    pronouns: 'he/him',
    status: 'Active',
    primaryClinician: 'Dr. Emily Chen',
    primaryClinicianId: 'u1',
    diagnosis: ['PTSD'],
    paymentType: 'Cash-pay',
    phone: '(212) 555-0166',
    email: 'jokafor@example.com',
    address: 'Queens, NY',
    nextAppointment: '2026-05-23T09:00:00',
    lastAppointment: '2026-05-16T09:00:00',
    outstandingBalance: 0,
    riskLevel: 'Low',
    initials: 'JO',
    salesforceContactId: '003Bi00000OPRbwIAH',
  },
  {
    id: 'p5',
    slug: 'elena-rivera',
    name: 'Elena Rivera',
    dob: '2001-09-30',
    age: 24,
    pronouns: 'she/they',
    status: 'New',
    primaryClinician: 'Dr. Emily Chen',
    primaryClinicianId: 'u1',
    diagnosis: ['Intake pending'],
    paymentType: 'Cash-pay',
    phone: '(347) 555-0123',
    email: 'elena.r@example.com',
    address: 'Bronx, NY',
    nextAppointment: '2026-05-22T13:00:00',
    outstandingBalance: 0,
    riskLevel: 'Low',
    initials: 'ER',
    salesforceContactId: '003Bi00000OPRbxIAH',
  },
  {
    id: 'p6',
    slug: 'david-kim',
    name: 'David Kim',
    dob: '1989-04-17',
    age: 36,
    pronouns: 'he/him',
    status: 'Active',
    primaryClinician: 'Dr. Emily Chen',
    primaryClinicianId: 'u1',
    diagnosis: ['OCD'],
    paymentType: 'Cash-pay',
    phone: '(718) 555-0177',
    email: 'dkim@example.com',
    address: 'Brooklyn, NY',
    nextAppointment: '2026-05-22T16:30:00',
    lastAppointment: '2026-05-15T16:30:00',
    outstandingBalance: 0,
    riskLevel: 'Low',
    initials: 'DK',
    salesforceContactId: '003Bi00000OPRbyIAH',
  },
  {
    id: 'p7',
    slug: 'amanda-foster',
    name: 'Amanda Foster',
    dob: '1993-12-05',
    age: 32,
    pronouns: 'she/her',
    status: 'Active',
    primaryClinician: 'Dr. David Park',
    primaryClinicianId: 'u2',
    diagnosis: ['Social Anxiety Disorder'],
    paymentType: 'Cash-pay',
    phone: '(646) 555-0199',
    email: 'afoster@example.com',
    address: 'Manhattan, NY',
    nextAppointment: '2026-05-23T11:00:00',
    lastAppointment: '2026-05-09T11:00:00',
    outstandingBalance: 0,
    riskLevel: 'Low',
    initials: 'AF',
    salesforceContactId: '003Bi00000OPRbzIAH',
  },
];

export const getPatient = (slug: string) =>
  patients.find(p => p.slug === slug);

// Week of May 18, 2026 (Mon-Sun)
const isoDate = (mmdd: string, time: string) => `2026-${mmdd}T${time}:00`;

export const weekAppointments: Appointment[] = [
  // Monday May 18 (past)
  { id: 'a01', patientId: 'p1', patientName: 'Sarah Mitchell', clinician: 'Dr. Emily Chen', type: 'Therapy', start: isoDate('05-18', '14:00'), durationMin: 50, status: 'Completed', location: 'Telehealth', notesStatus: 'AI Drafted' },
  { id: 'a02', patientId: 'p2', patientName: 'Marcus Johnson', clinician: 'Dr. Emily Chen', type: 'Therapy', start: isoDate('05-18', '10:00'), durationMin: 50, status: 'Completed', location: 'Telehealth', notesStatus: 'Complete' },
  { id: 'a03', patientId: 'p4', patientName: 'James Okafor', clinician: 'Dr. Emily Chen', type: 'Therapy', start: isoDate('05-18', '09:00'), durationMin: 50, status: 'Completed', location: 'In-person', notesStatus: 'Complete' },
  // Tuesday May 19
  { id: 'a04', patientId: 'p3', patientName: 'Priya Shah', clinician: 'Dr. David Park', type: 'Therapy', start: isoDate('05-19', '15:30'), durationMin: 50, status: 'Completed', location: 'Telehealth', notesStatus: 'Complete' },
  { id: 'a05', patientId: 'p6', patientName: 'David Kim', clinician: 'Dr. Emily Chen', type: 'Therapy', start: isoDate('05-19', '16:30'), durationMin: 50, status: 'Completed', location: 'Telehealth', notesStatus: 'Complete' },
  // Wednesday May 20
  { id: 'a06', patientId: 'p7', patientName: 'Amanda Foster', clinician: 'Dr. David Park', type: 'Therapy', start: isoDate('05-20', '11:00'), durationMin: 50, status: 'Completed', location: 'In-person', notesStatus: 'Complete' },
  { id: 'a07', patientId: 'p2', patientName: 'Marcus Johnson', clinician: 'Dr. Emily Chen', type: 'Therapy', start: isoDate('05-20', '10:00'), durationMin: 50, status: 'Completed', location: 'Telehealth', notesStatus: 'Complete' },
  // Thursday May 21
  { id: 'a08t', patientId: 'p4', patientName: 'James Okafor', clinician: 'Dr. Emily Chen', type: 'Therapy', start: isoDate('05-21', '09:00'), durationMin: 50, status: 'Completed', location: 'In-person', notesStatus: 'Complete' },
  { id: 'a09t', patientId: 'p2', patientName: 'Marcus Johnson', clinician: 'Dr. Emily Chen', type: 'Therapy', start: isoDate('05-21', '10:00'), durationMin: 50, status: 'Completed', location: 'Telehealth', notesStatus: 'Complete' },
  // Friday May 22 (today)
  { id: 'a08', patientId: 'p5', patientName: 'Elena Rivera', clinician: 'Dr. Emily Chen', type: 'Intake', start: isoDate('05-22', '13:00'), durationMin: 60, status: 'Confirmed', location: 'Telehealth', notesStatus: 'Pending' },
  { id: 'a09', patientId: 'p4', patientName: 'James Okafor', clinician: 'Dr. Emily Chen', type: 'Therapy', start: isoDate('05-22', '09:00'), durationMin: 50, status: 'Completed', location: 'In-person', notesStatus: 'Draft' },
  { id: 'a11', patientId: 'p2', patientName: 'Marcus Johnson', clinician: 'Dr. Emily Chen', type: 'Therapy', start: isoDate('05-22', '10:00'), durationMin: 50, status: 'Confirmed', location: 'Telehealth' },
  { id: 'a10', patientId: 'p6', patientName: 'David Kim', clinician: 'Dr. Emily Chen', type: 'Therapy', start: isoDate('05-22', '16:30'), durationMin: 50, status: 'Scheduled', location: 'Telehealth' },
  { id: 'a12', patientId: 'p7', patientName: 'Amanda Foster', clinician: 'Dr. David Park', type: 'Therapy', start: isoDate('05-23', '11:00'), durationMin: 50, status: 'Scheduled', location: 'In-person' },
  // Next week: Sarah's next appt
  { id: 'a13', patientId: 'p1', patientName: 'Sarah Mitchell', clinician: 'Dr. Emily Chen', type: 'Therapy', start: isoDate('05-26', '14:00'), durationMin: 50, status: 'Confirmed', location: 'Telehealth' },
];

export const sarahAppointments: Appointment[] = [
  { id: 'sa1', patientId: 'p1', patientName: 'Sarah Mitchell', clinician: 'Dr. Emily Chen', type: 'Therapy', start: '2026-05-26T14:00:00', durationMin: 50, status: 'Confirmed', location: 'Telehealth' },
  { id: 'sa2', patientId: 'p1', patientName: 'Sarah Mitchell', clinician: 'Dr. Emily Chen', type: 'Therapy', start: '2026-05-19T14:00:00', durationMin: 50, status: 'No-show', location: 'Telehealth' },
  { id: 'sa3', patientId: 'p1', patientName: 'Sarah Mitchell', clinician: 'Dr. Emily Chen', type: 'Therapy', start: '2026-05-12T14:00:00', durationMin: 50, status: 'Completed', location: 'Telehealth', notesStatus: 'Complete' },
  { id: 'sa4', patientId: 'p1', patientName: 'Sarah Mitchell', clinician: 'Dr. Emily Chen', type: 'Therapy', start: '2026-05-05T14:00:00', durationMin: 50, status: 'Completed', location: 'Telehealth', notesStatus: 'AI Drafted' },
  { id: 'sa5', patientId: 'p1', patientName: 'Sarah Mitchell', clinician: 'Dr. Emily Chen', type: 'Therapy', start: '2026-04-28T14:00:00', durationMin: 50, status: 'No-show', location: 'Telehealth' },
  { id: 'sa6', patientId: 'p1', patientName: 'Sarah Mitchell', clinician: 'Dr. Emily Chen', type: 'Therapy', start: '2026-04-21T14:00:00', durationMin: 50, status: 'Completed', location: 'Telehealth', notesStatus: 'Complete' },
  { id: 'sa7', patientId: 'p1', patientName: 'Sarah Mitchell', clinician: 'Dr. Emily Chen', type: 'Therapy', start: '2026-04-14T14:00:00', durationMin: 50, status: 'Completed', location: 'Telehealth', notesStatus: 'Complete' },
];

export const sarahNotes: Note[] = [
  {
    id: 'n1',
    patientId: 'p1',
    date: '2026-05-05',
    clinician: 'Dr. Emily Chen',
    type: 'Progress',
    status: 'AI Drafted',
    summary:
      'Session focused on work-related stressors. Patient reports increased anxiety following team restructure. Sleep latency 60+ minutes 4 nights this week. PHQ-9: 16 (up from 11). Discussed cognitive reframing techniques and re-introduced evening wind-down protocol.',
  },
  {
    id: 'n2',
    patientId: 'p1',
    date: '2026-04-21',
    clinician: 'Dr. Emily Chen',
    type: 'Progress',
    status: 'Signed',
    summary:
      'Patient appeared brighter than prior sessions. Successfully implemented breathing exercises during a panic episode at work. PHQ-9: 11.',
  },
  {
    id: 'n3',
    patientId: 'p1',
    date: '2026-04-14',
    clinician: 'Dr. Emily Chen',
    type: 'Progress',
    status: 'Signed',
    summary:
      'Continued work on cognitive distortions. Patient reports relationship with mother continues to be a source of stress. PHQ-9: 14.',
  },
  {
    id: 'n4',
    patientId: 'p1',
    date: '2026-03-12',
    clinician: 'Dr. Emily Chen',
    type: 'Treatment Plan',
    status: 'Signed',
    summary:
      'Updated treatment plan. Weekly individual therapy, CBT-focused. Adjunctive medication management referred to Dr. Patel.',
  },
];

export const sarahMessages: Message[] = [
  { id: 'm1', patientId: 'p1', patientName: 'Sarah Mitchell', preview: "Hi Dr. Chen — I'm so sorry I missed Tuesday's session. Can we...", timestamp: '2026-05-20T08:14:00', unread: true, channel: 'Portal' },
  { id: 'm2', patientId: 'p1', patientName: 'Sarah Mitchell', preview: 'Thanks for the worksheet, I tried it last night.', timestamp: '2026-05-13T20:02:00', unread: false, channel: 'Portal' },
  { id: 'm3', patientId: 'p1', patientName: 'Sarah Mitchell', preview: 'Confirming our session tomorrow at 2pm.', timestamp: '2026-05-04T16:11:00', unread: false, channel: 'SMS' },
];

export const inboxMessages: Message[] = [
  { id: 'im1', patientId: 'p1', patientName: 'Sarah Mitchell', preview: "Hi Dr. Chen — I'm so sorry I missed Tuesday's session. Can we...", timestamp: '2026-05-20T08:14:00', unread: true, channel: 'Portal' },
  { id: 'im2', patientId: 'p5', patientName: 'Elena Rivera', preview: 'Confirming my intake appointment for today.', timestamp: '2026-05-21T07:30:00', unread: true, channel: 'Portal' },
  { id: 'im3', patientId: 'p4', patientName: 'James Okafor', preview: 'Could you send me the grounding handout we discussed?', timestamp: '2026-05-20T18:45:00', unread: true, channel: 'Portal' },
  { id: 'im4', patientId: 'p7', patientName: 'Amanda Foster', preview: 'Insurance question — though I know I am cash-pay.', timestamp: '2026-05-20T11:22:00', unread: true, channel: 'Portal' },
  { id: 'im5', patientId: 'p6', patientName: 'David Kim', preview: 'Need to reschedule next week.', timestamp: '2026-05-19T14:08:00', unread: true, channel: 'Portal' },
];

export const sarahBilling: BillingItem[] = [
  { id: 'b1', patientId: 'p1', date: '2026-05-05', description: 'Therapy session (50 min)', amount: 175, status: 'Outstanding' },
  { id: 'b2', patientId: 'p1', date: '2026-04-28', description: 'Therapy session (no-show fee)', amount: 75, status: 'Outstanding' },
  { id: 'b3', patientId: 'p1', date: '2026-04-21', description: 'Therapy session (50 min)', amount: 175, status: 'Paid' },
  { id: 'b4', patientId: 'p1', date: '2026-04-14', description: 'Therapy session (50 min)', amount: 175, status: 'Paid' },
  { id: 'b5', patientId: 'p1', date: '2026-04-07', description: 'Therapy session (50 min)', amount: 175, status: 'Paid' },
];

export const sarahPhq9: { date: string; score: number }[] = [
  { date: '2026-02-10', score: 12 },
  { date: '2026-03-12', score: 14 },
  { date: '2026-04-14', score: 14 },
  { date: '2026-04-21', score: 11 },
  { date: '2026-05-05', score: 16 },
];

// Intake pipeline (Lauren's view)
export type IntakeLead = {
  id: string;
  name: string;
  initials: string;
  submittedAt: string;
  reason: string;
  preferredModality: 'Telehealth' | 'In-person' | 'Either';
  paymentType: 'Cash-pay';
  matchScore: number;
  suggestedClinician: string;
  stage: 'New' | 'Outreach' | 'Scheduled' | 'Converted';
  source: 'Website' | 'Google Ads' | 'Referral' | 'Mailchimp';
  aiSummary: string;
};

export const intakeLeads: IntakeLead[] = [
  {
    id: 'il1',
    name: 'Olivia Bennett',
    initials: 'OB',
    submittedAt: '2026-05-21T09:14:00',
    reason: 'Anxiety, sleep issues',
    preferredModality: 'Telehealth',
    paymentType: 'Cash-pay',
    matchScore: 94,
    suggestedClinician: 'Dr. Emily Chen',
    stage: 'New',
    source: 'Website',
    aiSummary:
      'High match — anxiety + cash-pay + telehealth. Dr. Chen has Tues 3pm and Thurs 11am open this week.',
  },
  {
    id: 'il2',
    name: 'Tyler Brooks',
    initials: 'TB',
    submittedAt: '2026-05-21T08:02:00',
    reason: 'Grief after recent loss',
    preferredModality: 'In-person',
    paymentType: 'Cash-pay',
    matchScore: 88,
    suggestedClinician: 'Dr. David Park',
    stage: 'New',
    source: 'Google Ads',
    aiSummary:
      'Bereavement specialty needed. Suggest Dr. Park (in-person, Manhattan). Drafted outreach message ready.',
  },
  {
    id: 'il3',
    name: 'Mei Tanaka',
    initials: 'MT',
    submittedAt: '2026-05-20T18:30:00',
    reason: 'Couples counseling',
    preferredModality: 'Either',
    paymentType: 'Cash-pay',
    matchScore: 82,
    suggestedClinician: 'Dr. Rachel Goldberg',
    stage: 'Outreach',
    source: 'Referral',
    aiSummary: 'Couples track — Dr. Goldberg confirmed availability. Outreach sent 12h ago.',
  },
  {
    id: 'il4',
    name: 'Jordan Lee',
    initials: 'JL',
    submittedAt: '2026-05-20T15:21:00',
    reason: 'Panic attacks at work',
    preferredModality: 'Telehealth',
    paymentType: 'Cash-pay',
    matchScore: 91,
    suggestedClinician: 'Dr. Emily Chen',
    stage: 'Scheduled',
    source: 'Google Ads',
    aiSummary: 'Intake scheduled for 5/24. Pre-session packet sent.',
  },
];
