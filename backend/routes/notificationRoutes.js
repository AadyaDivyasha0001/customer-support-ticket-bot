// routes/notificationRoutes.js

router.get("/", async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .sort({ updatedAt: -1 })
      .limit(10);

    const notifications = [];

    tickets.forEach((ticket) => {
      ticket.activityLogs?.forEach((log) => {
        notifications.push({
          message: log.message,
          timestamp: log.timestamp,
        });
      });
    });

    notifications.sort(
      (a, b) =>
        new Date(b.timestamp) -
        new Date(a.timestamp)
    );

    res.json(
      notifications.slice(0, 10)
    );
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});