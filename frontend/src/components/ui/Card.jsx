export default function Card({children}) {
    return (
        <div
            className="text-foreground bg-surface rounded-2xl p-5 shadow-card"
        >
        {children}
        </div>
    );
}