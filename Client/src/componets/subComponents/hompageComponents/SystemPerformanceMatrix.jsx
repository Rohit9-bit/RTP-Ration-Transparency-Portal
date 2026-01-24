import React, { useEffect } from 'react'

const SystemPerformanceMatrix = () => {
    useEffect(() => {
        // Placeholder for future data fetching or side effects
        fetch('http://localhost:3000/public/dashboard')
            .then(response => response.json())
            .then(data => {
                // Handle the fetched data
                console.log(data);
            })
            .catch(error => {
                console.error('Error fetching dashboard data:', error);
            });
    }, []);

  return (
    <section className='bg-gray-50 px-30 py-15'>
        <div className='text-center'>
            <h2 className='text-4xl font-bold'>System Performance Matrics</h2>
            <p className='text-xl text-gray-600 my-3'>Real-time data on distribution system perfomance and beneficiary service</p>
        </div>
    </section>
  )
}

export default SystemPerformanceMatrix