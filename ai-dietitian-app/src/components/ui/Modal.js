import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4 z-[100]">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>
                <div className="overflow-y-auto flex-grow">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
