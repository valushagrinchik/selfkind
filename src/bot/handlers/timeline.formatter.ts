export function formatTimeline(
    moments: any[],
    format: (moment: any) => string
): string {
    if (!moments.length) {
        return (
            '🌱 Пока здесь пусто.\n\n' +
            'Первый момент доверия себе появится здесь.'
        );
    }

    const grouped: { [key: string]: any[] } = moments
        .map((moment) => ({
            ...moment,
            formatedDate: formatDate(moment.createdAt)
        })).reduce((res, cur) => {
            if (!res[cur.formatedDate]) {
                res[cur.formatedDate] = [];
            }
            res[cur.formatedDate].push(cur);
            return res;
        }, {})

    return Object.entries(grouped).map(([date, moments]) => {
        return (
            `─────── 🤍 ${date} ──────\n\n` + moments.map(format).join('\n\n')
        );
    }).join('\n\n');
}

function formatDate(date: Date) {
    return new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
    }).format(date);
}