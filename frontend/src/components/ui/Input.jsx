export default function Input(props) {
    return (
        <input
        {...props}
        className="w-full rounded-lg border border-border px-3 py-2
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus
        aria-invalid:border-error disabled:opacity-50 disabled:cursor-not-allowed"
        />
    );
}