#!/bin/bash

# Automated Daily Dad Jokes Update Script
# This script generates tomorrow's joke, uploads the image, and deploys to production

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "🚀 Starting automated daily joke update..."
echo "📅 $(date)"
echo "📁 Working directory: $PROJECT_DIR"

# Generate tomorrow's joke and image
echo "🎭 Generating tomorrow's joke..."
node daily-joke-generator.js

# Check if joke generation was successful
if [ $? -eq 0 ]; then
    echo "✅ Joke generation completed successfully"

    # Commit and push changes
    echo "📝 Committing changes to git..."
    git add .

    # Create commit message with date
    TOMORROW=$(date -v +1d +%Y-%m-%d 2>/dev/null || date -d "tomorrow" +%Y-%m-%d 2>/dev/null || date +%Y-%m-%d)

    git commit -m "🤖 Automated daily joke for $TOMORROW

Generated new dad joke and AI image for tomorrow.
Automated deployment via cron job.

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

    if [ $? -eq 0 ]; then
        echo "📤 Pushing to GitHub (triggers Vercel deployment)..."
        git push

        if [ $? -eq 0 ]; then
            echo "🎉 Successfully deployed tomorrow's joke!"
            echo "🌐 Website will update automatically via Vercel"
        else
            echo "❌ Failed to push to GitHub"
            exit 1
        fi
    else
        echo "ℹ️  No changes to commit (joke might already exist)"
    fi
else
    echo "❌ Joke generation failed"
    exit 1
fi

echo "✅ Automated update completed at $(date)"