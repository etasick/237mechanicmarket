'use client';

import { useEffect } from 'react';
import { Amplify } from '@aws-amplify/core';
import { Auth } from '@aws-amplify/auth';
import amplifyconfig from './amplifyconfiguration.json';

export default function AmplifyProvider() {
    useEffect(() => {
        Amplify.configure(amplifyconfig);
        console.log(Auth);
    }, []);

    return null;
}
