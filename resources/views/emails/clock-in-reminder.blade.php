<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Clock In Reminder</title>
</head>
<body style="font-family: Arial, sans-serif; color: #333;">
    <h2>Hello, {{ $name }} 👋</h2>
    <p>Your workday is about to start in 5 minutes!</p>
    <p>Click below to log in and automatically clock in for today:</p>

    <a href="{{ url('/auto-clock/login-clockin/' . $token) }}"
       style="background-color: #2563eb; color: white; padding: 10px 15px; border-radius: 5px; text-decoration: none;">
        Clock In Now
    </a>

    <p style="margin-top: 20px; color: #777;">If you do not click this link before your shift starts, you won’t be clocked in automatically.</p>
</body>
</html>
