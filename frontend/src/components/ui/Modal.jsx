import { useEffect, useId, useRef } from "react";

export default function Modal({ children, isOpen, onClose, title }) {
    const dialogRef = useRef(null);
    const titleId = useId();
    useEffect(() => {
        const dialog = dialogRef.current;

        if (isOpen) {
            dialog.showModal();
        } else {
            dialog.close();
        }
    }, [isOpen]);

    return (
        <dialog 
            ref={dialogRef}
            onCancel={(event) => {
                event.preventDefault();
                onClose();
            }}
            aria-labelledby={titleId}
            className="relative m-auto bg-surface p-4 sm:p-8 rounded-lg"
            >
            <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="absolute right-2 top-2 rounded px-2 py-1 text-xl focus-visible:outline-2 focus-visible:outline-focus">
                ×
            </button>
            <h2 id ={titleId} className="mb-6 text-2xl font-bold">
                {title}
            </h2>
            {children}
        </dialog>
    );
}