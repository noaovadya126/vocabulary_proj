import { cn } from '@/lib/cn';

import { HTMLAttributes } from 'react';



interface CardProps extends HTMLAttributes<HTMLDivElement> {

  padding?: 'none' | 'sm' | 'md' | 'lg';

}



const paddingMap = {

  none: '',

  sm: 'p-4',

  md: 'p-6',

  lg: 'p-8',

};



export function Card({ className, padding = 'md', children, ...props }: CardProps) {

  return (

    <div

      className={cn(

        'cute-card-texture rounded-3xl border-2 border-pastel-pink/50 shadow-soft',

        paddingMap[padding],

        className

      )}

      {...props}

    >

      {children}

    </div>

  );

}

