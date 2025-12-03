export type Lead = {
    id: string;
    name: string;
    email: string;
    program: string;
    status: 'new' | 'contacted' | 'qualified' | 'converted';
    date: string;
};

export const leads: Lead[] = [
    { id: 'l1', name: 'Maria Garcia', email: 'maria@example.com', program: 'Oxford Summer Academy', status: 'new', date: '2h ago' },
    { id: 'l2', name: 'James Wilson', email: 'james@example.com', program: 'Silicon Valley Tech Tour', status: 'contacted', date: '1d ago' },
    { id: 'l3', name: 'Elena Rodriguez', email: 'elena@example.com', program: 'Tokyo Cultural Immersion', status: 'qualified', date: '2d ago' },
    { id: 'l4', name: 'David Kim', email: 'david@example.com', program: 'Leadership Camp', status: 'converted', date: '3d ago' },
];

export type Quote = {
    id: string;
    client: string;
    program: string;
    amount: string;
    status: 'draft' | 'sent' | 'approved' | 'rejected';
    date: string;
};

export const quotes: Quote[] = [
    { id: 'q1', client: 'School Group A', program: 'Custom Europe Tour', amount: '$45,000', status: 'sent', date: 'Dec 10, 2025' },
    { id: 'q2', client: 'John Smith', program: 'Silicon Valley Tech Tour', amount: '$4,500', status: 'approved', date: 'Dec 12, 2025' },
    { id: 'q3', client: 'Sarah Lee', program: 'Oxford Summer Academy', amount: '£3,800', status: 'draft', date: 'Dec 14, 2025' },
];

export type WorkflowItem = {
    id: string;
    title: string;
    requester: string;
    type: 'expense' | 'discount' | 'refund';
    amount: string;
    status: 'pending' | 'approved' | 'rejected';
    date: string;
};

export const workflowItems: WorkflowItem[] = [
    { id: 'w1', title: 'Flight Booking - Group A', requester: 'Ops Team', type: 'expense', amount: '$12,000', status: 'pending', date: '2h ago' },
    { id: 'w2', title: 'Special Discount - Lead #L2', requester: 'Sales Team', type: 'discount', amount: '10%', status: 'approved', date: '1d ago' },
    { id: 'w3', title: 'Refund Request - Client #C4', requester: 'Support Team', type: 'refund', amount: '$500', status: 'rejected', date: '3d ago' },
];

export type FinanceRecord = {
    id: string;
    description: string;
    type: 'income' | 'expense';
    category: string;
    amount: string;
    date: string;
    status: 'cleared' | 'pending';
};

export const financeRecords: FinanceRecord[] = [
    { id: 'f1', description: 'Payment from Maria Garcia', type: 'income', category: 'Program Fee', amount: '+$1,500', date: 'Dec 15, 2025', status: 'cleared' },
    { id: 'f2', description: 'Hotel Deposit - London', type: 'expense', category: 'Accommodation', amount: '-$5,000', date: 'Dec 14, 2025', status: 'pending' },
    { id: 'f3', description: 'Facebook Ads Campaign', type: 'expense', category: 'Marketing', amount: '-$800', date: 'Dec 12, 2025', status: 'cleared' },
];
