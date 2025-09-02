// In-memory storage for rent records
let rentRecords = [
  {
    id: 1,
    studentId: 2,
    pgId: 1,
    amount: 8000,
    month: 1,
    year: 2024,
    dueDate: new Date('2024-01-05'),
    paidDate: new Date('2024-01-03'),
    status: "Paid",
    reminderSent: false
  },
  {
    id: 2,
    studentId: 2,
    pgId: 1,
    amount: 8000,
    month: 2,
    year: 2024,
    dueDate: new Date('2024-02-05'),
    paidDate: null,
    status: "Unpaid",
    reminderSent: true
  }
];

let nextId = 3;

module.exports = {
  getAllRentRecords: () => rentRecords,
  
  getRentRecordById: (id) => rentRecords.find(record => record.id === parseInt(id)),
  
  getRentRecordsByStudentId: (studentId) => 
    rentRecords.filter(record => record.studentId === parseInt(studentId)),
  
  getRentRecordsByPgId: (pgId) => 
    rentRecords.filter(record => record.pgId === parseInt(pgId)),
  
  createRentRecord: (rentData) => {
    const newRecord = {
      id: nextId++,
      ...rentData,
      status: "Unpaid",
      paidDate: null,
      reminderSent: false
    };
    rentRecords.push(newRecord);
    return newRecord;
  },
  
  updateRentRecord: (id, updates) => {
    const index = rentRecords.findIndex(record => record.id === parseInt(id));
    if (index !== -1) {
      if (updates.status === "Paid" && rentRecords[index].status !== "Paid") {
        updates.paidDate = new Date();
      }
      rentRecords[index] = { ...rentRecords[index], ...updates };
      return rentRecords[index];
    }
    return null;
  },
  
  deleteRentRecord: (id) => {
    const index = rentRecords.findIndex(record => record.id === parseInt(id));
    if (index !== -1) {
      return rentRecords.splice(index, 1)[0];
    }
    return null;
  },
  
  getUnpaidRentRecords: () => rentRecords.filter(record => record.status === "Unpaid"),
  
  getPaidRentRecords: () => rentRecords.filter(record => record.status === "Paid"),
  
  getRentRecordsDueSoon: (days = 3) => {
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + days);
    
    return rentRecords.filter(record => 
      record.status === "Unpaid" && 
      record.dueDate <= dueDate && 
      record.dueDate >= today
    );
  },
  
  markReminderSent: (id) => {
    const index = rentRecords.findIndex(record => record.id === parseInt(id));
    if (index !== -1) {
      rentRecords[index].reminderSent = true;
      return rentRecords[index];
    }
    return null;
  },
  
  generateMonthlyRent: (studentId, pgId, amount, month, year) => {
    const dueDate = new Date(year, month - 1, 5); // 5th of the month
    
    return this.createRentRecord({
      studentId,
      pgId,
      amount,
      month,
      year,
      dueDate
    });
  }
};
