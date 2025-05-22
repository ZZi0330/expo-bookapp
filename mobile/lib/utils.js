export function formatMemberSince(dateString) {
    const date = new Date(dateString); // 变量名改为 date 更清晰
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return ` ${year} ${month}`
}

export function formatPublishDate(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    // getMonth() 返回 0-11，所以需要 +1
    // 使用 padStart(2, '0') 确保月份始终是两位数 (例如 05, 09)
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    // getDate() 返回 1-31
    // 使用 padStart(2, '0') 确保日期始终是两位数 (例如 01, 09)
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}