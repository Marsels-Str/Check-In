<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Clock Out Reminder</title>
</head>
<body style="font-family: Arial, sans-serif; color: #333;">
    <h2>Hello, {{ $name }} 👋</h2>
    <p>Your workday is ending in 5 minutes.</p>
    <p>If you’re planning to continue working longer, click the button below to extend your shift:</p>

    <a href="{{ url('/auto-clock/extend-work/' . $token) }}"
       style="background-color: #16a34a; color: white; padding: 10px 15px; border-radius: 5px; text-decoration: none;">
        Extend Work Time
    </a>

    <p style="margin-top: 20px; color: #777;">If you don’t click this link, you’ll be clocked out automatically when your shift ends.</p>
</body>
</html>
