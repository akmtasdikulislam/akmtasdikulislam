"""Generate a monthly commit-contribution SVG using the authenticated GitHub CLI."""
import argparse
import calendar
from datetime import datetime, timedelta, timezone
from html import escape
import json
from pathlib import Path
import subprocess

DHAKA = timezone(timedelta(hours=6), name="Asia/Dhaka")


def month_start(index):
    year, month = divmod(index, 12)
    return datetime(year, month + 1, 1, tzinfo=DHAKA)


def fetch_months(username, now):
    current = now.year * 12 + now.month - 1
    starts = [month_start(current - 11 + i) for i in range(12)]
    fields = []
    for i, start in enumerate(starts):
        end = min(month_start(current - 10 + i) - timedelta(seconds=1), now)
        fields.append(
            f'm{i}: contributionsCollection(from: {json.dumps(start.isoformat())}, '
            f'to: {json.dumps(end.isoformat())}) {{ totalCommitContributions }}'
        )
    query = 'query { user(login: ' + json.dumps(username) + ') { ' + ' '.join(fields) + ' } }'
    result = subprocess.run(
        ['gh', 'api', 'graphql', '--input', '-'],
        input=json.dumps({'query': query}), capture_output=True, text=True, check=True,
    )
    response = json.loads(result.stdout)
    if response.get('errors') or not response.get('data', {}).get('user'):
        raise RuntimeError('GitHub did not return valid contribution data; existing chart preserved.')
    user = response['data']['user']
    return [(start, user[f'm{i}']['totalCommitContributions']) for i, start in enumerate(starts)]


def render(months, now):
    maximum = max(1, max(count for _, count in months))
    parts = [
        '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200" role="img" aria-labelledby="title desc">',
        '<title id="title">Monthly commit contributions</title>',
        '<desc id="desc">' + escape('; '.join(f'{date:%B %Y}: {count}' for date, count in months)) + '. Bangladesh time (UTC+6). Current month is partial.</desc>',
        '<rect x="0.5" y="0.5" width="299" height="199" rx="5" fill="#0d1117" stroke="#30363d"/>',
        '<g font-family="Arial, sans-serif">',
        '<text x="15" y="26" fill="#10b77f" font-size="16" font-weight="600">Monthly commits</text>',
        '<text x="15" y="43" fill="#8b949e" font-size="9">Bangladesh (UTC+6) · Current month partial</text>',
    ]
    for fraction in [0, 0.5, 1]:
        y = 148 - fraction * 84
        parts.append(f'<path d="M30 {y} H287" stroke="#21262d"/>')
        parts.append(f'<text x="27" y="{y + 3}" text-anchor="end" fill="#8b949e" font-size="8">{round(maximum * fraction)}</text>')
    for i, (date, count) in enumerate(months):
        x = 33 + i * 21
        height = count / maximum * 84
        color = '#3b82f6' if i == 11 else '#10b77f'
        parts.append(f'<rect x="{x}" y="{148-height:.2f}" width="14" height="{height:.2f}" rx="2" fill="{color}"><title>{date:%B %Y}: {count} commits</title></rect>')
        parts.append(f'<text x="{x+7}" y="{max(59, 144-height):.2f}" text-anchor="middle" fill="#c9d1d9" font-size="7">{count}</text>')
        parts.append(f'<text x="{x+7}" y="161" text-anchor="middle" fill="#8b949e" font-size="8">{calendar.month_abbr[date.month]}</text>')
    parts.append(f'<text x="15" y="182" fill="#8b949e" font-size="9">{months[0][0]:%b %Y} – {months[-1][0]:%b %Y} · Updated {now:%d %b}</text>')
    parts.append('</g></svg>')
    return '\n'.join(parts) + '\n'


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--username', default='akmtasdikulislam')
    parser.add_argument('--output', default='assets/monthly-commits.svg')
    parser.add_argument('--as-of', help='Optional ISO timestamp for a reproducible snapshot.')
    args = parser.parse_args()
    now = datetime.fromisoformat(args.as_of).astimezone(DHAKA) if args.as_of else datetime.now(DHAKA)
    months = fetch_months(args.username, now)
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(render(months, now), encoding='utf-8')
    print(json.dumps({date.strftime('%Y-%m'): count for date, count in months}))
