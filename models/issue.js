// In-memory storage for issues
let issues = [
  {
    id: 1,
    title: "Water Leakage",
    description: "There's a water leakage in bathroom number 3",
    studentId: 2,
    pgId: 1,
    status: "Open",
    createdAt: new Date('2024-01-15'),
    resolvedAt: null
  },
  {
    id: 2,
    title: "WiFi Not Working",
    description: "WiFi has been down since yesterday evening",
    studentId: 2,
    pgId: 1,
    status: "Resolved",
    createdAt: new Date('2024-01-10'),
    resolvedAt: new Date('2024-01-11')
  }
];

let nextId = 3;

module.exports = {
  getAllIssues: () => issues,
  
  getIssueById: (id) => issues.find(issue => issue.id === parseInt(id)),
  
  getIssuesByPgId: (pgId) => issues.filter(issue => issue.pgId === parseInt(pgId)),
  
  getIssuesByStudentId: (studentId) => issues.filter(issue => issue.studentId === parseInt(studentId)),
  
  createIssue: (issueData) => {
    const newIssue = {
      id: nextId++,
      ...issueData,
      status: "Open",
      createdAt: new Date(),
      resolvedAt: null
    };
    issues.push(newIssue);
    return newIssue;
  },
  
  updateIssue: (id, updates) => {
    const index = issues.findIndex(issue => issue.id === parseInt(id));
    if (index !== -1) {
      if (updates.status === "Resolved" && issues[index].status !== "Resolved") {
        updates.resolvedAt = new Date();
      }
      issues[index] = { ...issues[index], ...updates };
      return issues[index];
    }
    return null;
  },
  
  deleteIssue: (id) => {
    const index = issues.findIndex(issue => issue.id === parseInt(id));
    if (index !== -1) {
      return issues.splice(index, 1)[0];
    }
    return null;
  },
  
  getOpenIssues: () => issues.filter(issue => issue.status === "Open"),
  
  getResolvedIssues: () => issues.filter(issue => issue.status === "Resolved"),
  
  getOwnerIssues: (ownerId) => {
    // This would need to be connected to PG listings to get owner's PGs
    // For now, return all issues
    return issues;
  }
};
