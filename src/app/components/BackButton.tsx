'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

export default function BackButton() {
    const router = useRouter();
    
    const goToPreviousPage = () => {
        router.back();
    };

    return (
        <button className="back-btn" onClick={goToPreviousPage}>
            <FaArrowLeft /> volver
        </button>
    );
}
