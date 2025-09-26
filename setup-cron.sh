#!/bin/bash

# Daily Dad Jokes - Automated Cron Setup Script
# This script sets up a daily cron job to generate tomorrow's joke automatically

# Get the current directory (where the project lives)
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Setting up automated daily joke generation..."
echo "📁 Project directory: $PROJECT_DIR"

# Create the cron job command
CRON_COMMAND="0 18 * * * cd $PROJECT_DIR && ./automated-daily-update.sh >> cron.log 2>&1"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "daily-joke"; then
    echo "⚠️  Cron job already exists. Removing old one..."
    crontab -l 2>/dev/null | grep -v "daily-joke" | crontab -
fi

# Add the new cron job
echo "📅 Adding daily cron job (runs at 6:00 PM every day)..."
(crontab -l 2>/dev/null; echo "$CRON_COMMAND") | crontab -

echo "✅ Cron job successfully set up!"
echo ""
echo "📋 Cron Details:"
echo "   • Runs daily at 6:00 PM (18:00)"
echo "   • Generates tomorrow's joke if it doesn't exist"
echo "   • Creates AI image automatically"
echo "   • Uploads image to Google Cloud Storage"
echo "   • Commits and pushes to GitHub"
echo "   • Triggers automatic Vercel deployment"
echo "   • Logs output to: $PROJECT_DIR/cron.log"
echo ""
echo "🔍 To view current cron jobs: crontab -l"
echo "🗑️  To remove this cron job: crontab -e (then delete the line)"
echo "📊 To check logs: tail -f $PROJECT_DIR/cron.log"
echo ""
echo "🧪 To test the script manually:"
echo "   cd $PROJECT_DIR && ./automated-daily-update.sh"