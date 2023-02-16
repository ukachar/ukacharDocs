import React from 'react'
import Test from '../components/test'

let fetchh = []
useEffect(() => {
    // GET request using fetch inside useEffect React hook
    fetch('https://localhost:3002/api/getAllDocuments')
        .then(response => response.json())
        .then(data => fetch.push(data));

    // empty dependency array means this effect will only run once (like componentDidMount in classes)
}, [])


export default function Home() {
    return (

        <div>
            <Test />
            {fetchh}
        </div>
    )
}


