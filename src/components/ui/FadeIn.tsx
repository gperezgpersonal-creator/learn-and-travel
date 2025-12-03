'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInProps {
    children: ReactNode;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    className?: string;
    fullWidth?: boolean;
}

export default function FadeIn({
    children,
    className = "",
    fullWidth = false
}: FadeInProps) {
    return (
        <div
            className={className}
            style={{ width: fullWidth ? '100%' : 'auto' }}
        >
            {children}
        </div>
    );
}
