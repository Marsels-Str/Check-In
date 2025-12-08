export default function BusinessName({ user }: { user: any }) {
    const businesses =
        Array.isArray(user.all_businesses) && user.all_businesses.length
            ? user.all_businesses.join(', ')
            : 'No business';

    return <span>{businesses}</span>;
}
