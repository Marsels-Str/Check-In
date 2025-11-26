interface SuccessMessageProps {
    message?: string;
    show?: boolean;
}

export default function SuccessMessage({ message = '', show = true }: SuccessMessageProps) {
    if (!show || !message) return null;

    return <div className="mb-4 rounded-lg bg-green-100 px-4 py-2 text-sm text-green-800 dark:bg-green-900/40 dark:text-green-200">{message}</div>;
}
