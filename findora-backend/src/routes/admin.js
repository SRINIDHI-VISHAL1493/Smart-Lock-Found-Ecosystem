// src/routes/admin.js
const express = require('express');
const router = express.Router();
const store = require('../config/demoStore');
const { authenticate, requireRole } = require('../middleware/auth');

// GET /api/admin/stats
router.get('/stats', authenticate, requireRole('institution_admin', 'super_admin', 'police'), (req, res) => {
  const stats = store.getStats();
  res.json(stats);
});

// GET /api/admin/users
router.get('/users', authenticate, requireRole('institution_admin', 'super_admin'), (req, res) => {
  const users = store.getAllUsers().map(u => ({ ...u })); // Don't expose sensitive fields
  res.json({ users });
});

// PUT /api/admin/users/:uid/role
router.put('/users/:uid/role', authenticate, requireRole('super_admin'), (req, res) => {
  const { role } = req.body;
  const validRoles = ['user', 'institution_admin', 'police', 'super_admin'];
  if (!validRoles.includes(role)) return res.status(400).json({ error: 'Invalid role' });

  const updated = store.updateUser(req.params.uid, { role });
  store.addAuditLog({ action: 'ROLE_CHANGED', userId: req.user.uid, targetUserId: req.params.uid, details: `Role -> ${role}` });
  res.json(updated);
});

// POST /api/admin/users/:uid/block
router.post('/users/:uid/block', authenticate, requireRole('institution_admin', 'super_admin'), (req, res) => {
  store.updateUser(req.params.uid, { blocked: true });
  store.addAuditLog({ action: 'USER_BLOCKED', userId: req.user.uid, targetUserId: req.params.uid });
  res.json({ message: 'User blocked' });
});

// POST /api/admin/users/:uid/unblock
router.post('/users/:uid/unblock', authenticate, requireRole('institution_admin', 'super_admin'), (req, res) => {
  store.updateUser(req.params.uid, { blocked: false });
  store.addAuditLog({ action: 'USER_UNBLOCKED', userId: req.user.uid, targetUserId: req.params.uid });
  res.json({ message: 'User unblocked' });
});

// GET /api/admin/audit-logs
router.get('/audit-logs', authenticate, requireRole('institution_admin', 'super_admin'), (req, res) => {
  const logs = store.getAuditLogs();
  res.json({ logs });
});

// GET /api/admin/reports (all reports for admin)
router.get('/reports', authenticate, requireRole('institution_admin', 'super_admin', 'police'), (req, res) => {
  const reports = store.getAllReports();
  reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ reports });
});

// Analytics endpoints
router.get('/analytics/categories', authenticate, requireRole('institution_admin', 'super_admin'), (req, res) => {
  const reports = store.getAllReports();
  const byCategory = {};
  reports.forEach(r => {
    if (!byCategory[r.category]) byCategory[r.category] = { lost: 0, found: 0, total: 0 };
    byCategory[r.category][r.type]++;
    byCategory[r.category].total++;
  });
  res.json({ data: Object.entries(byCategory).map(([name, counts]) => ({ name, ...counts })) });
});

router.get('/analytics/timeline', authenticate, requireRole('institution_admin', 'super_admin'), (req, res) => {
  const reports = store.getAllReports();
  const byDay = {};
  reports.forEach(r => {
    const day = r.createdAt.split('T')[0];
    if (!byDay[day]) byDay[day] = { date: day, lost: 0, found: 0, recovered: 0 };
    byDay[day][r.type]++;
    if (r.status === 'collected') byDay[day].recovered++;
  });
  res.json({ data: Object.values(byDay).sort((a, b) => a.date.localeCompare(b.date)) });
});

// Rewards leaderboard
router.get('/leaderboard', authenticate, (req, res) => {
  const users = store.getAllUsers()
    .filter(u => u.role === 'user')
    .sort((a, b) => (b.rewardPoints || 0) - (a.rewardPoints || 0))
    .slice(0, 20)
    .map((u, i) => ({
      rank: i + 1,
      uid: u.uid,
      displayName: u.displayName,
      rewardPoints: u.rewardPoints || 0,
      badges: u.badges || [],
    }));
  res.json({ leaderboard: users });
});

module.exports = router;
