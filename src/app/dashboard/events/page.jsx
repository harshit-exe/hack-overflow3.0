import Image from "next/image";

const events = [
  {
    id: 1,
    category: "Hackathon",
    title: "Code Kshetra 2.0",
    organizer: "TechCorp",
    date: "Feb 15-17, 2024",
    price: "Free",
    match: "95% Match",
    image: "/1111.jpeg",
    link: "https://code-kshetra-2.devfolio.co/"
  },
  {
    id: 2,
    category: "Webinar",
    title: "Global AI Bootcamp, Pune 2025 (In-Person)",
    organizer: "BlockchainHub",
    date: "Feb 20, 2024",
    price: "$49",
    match: "88% Match",
    image: "/2222.jpeg",
    link: "https://www.meetup.com/pune-tech-community/events/304790781/?recId=6be23403-fd9d-46ce-a45d-126cfe81f62b&recSource=ml-popular-events-nearby-offline&searchId=19a5c5aa-293f-4165-b9a8-aadd38e21d3c&eventOrigin=find_page$all&_gl=1*uioodk*_up*MQ..*_ga*MTI1MTg3NDYwNy4xNzQwMjI1ODQw*_ga_NP82XMKW0P*MTc0MDIyNTgzOS4xLjAuMTc0MDIyNTgzOS4wLjAuMA"
  },
  {
    id: 3,
    category: "Career Fair",
    title: "ML Learning series Day 1 : E2E ML implement",
    organizer: "CareerBoost",
    date: "Mar 1, 2024",
    price: "Free",
    match: "92% Match",
    image: "/3333.jpeg",
    link: "https://www.meetup.com/ml-lerarning-series/events/303843245/?recId=b9aaa373-5e1a-4248-a424-8de98fbd1c89&recSource=ml-popular-events-nearby-online&searchId=6e4d2977-1b94-483d-ac38-2e0f0e1f21c8&eventOrigin=find_page$all"
  },
  {
    id: 4,
    category: "Workshop",
    title: "Global AI Bootcamp 2025 - Mumbai - INDIA",
    organizer: "DesignLab",
    date: "Mar 5, 2024",
    price: "$79",
    match: "85% Match",
    image: "/4444.jpeg",
    link: "https://www.meetup.com/dear-azure-and-ai-mumbai-india-meetup/events/305774934/?recId=726dc063-b6cc-4565-bf49-af501208b309&recSource=ml-popular-events-nearby-offline&searchId=cc2c3144-6146-4c07-b21d-dc0ef15c9f16&eventOrigin=find_page$all"
  },
  {
    id: 5,
    category: "Conference",
    title: "Ultimate Guide to Secure WordPress Plugin Development",
    organizer: "AI Global",
    date: "Apr 10, 2024",
    price: "$99",
    match: "90% Match",
    image: "/5555.jpeg",
    link: "https://www.meetup.com/wpmumbai/events/305897547/?recId=d4ebabf2-b2a3-4d18-bd5f-7612a6ff184b&recSource=ml-popular-events-nearby-offline&searchId=2327f4fe-cfda-4e1f-a1e2-b3da735a57fe&eventOrigin=find_page$all"
  },
  {
    id: 6,
    category: "Seminar",
    title: "Data Analysis with NumPy, Pandas, and Python",
    organizer: "CryptoWorld",
    date: "Apr 15, 2024",
    price: "$59",
    match: "87% Match",
    image: "/6666.jpeg",
    link: "https://www.meetup.com/coderrange-ai-bigdata-datascience/events/306081962/?recId=7ffc36c3-0a96-4734-9abf-e811ef78818e&recSource=ml-popular-events-nearby-online&searchId=b8e6291b-3a00-42f1-8506-4fddd345589c&eventOrigin=find_page$all"
  },
  {
    id: 7,
    category: "Workshop",
    title: "ETHDenver 2025",
    organizer: "DesignLab",
    date: "Mar 5, 2024",
    price: "$79",
    match: "85% Match",
    image: "/7777.jpeg",
    link: "https://ethdenver2025.devfolio.co/"
  },
  {
    id: 8,
    category: "Conference",
    title: "Code Nakshatra",
    organizer: "AI Global",
    date: "Apr 10, 2024",
    price: "$99",
    match: "90% Match",
    image: "/8888.jpeg",
    link: "https://code-nakshatra.devfolio.co/"
  },
  {
    id: 9,
    category: "Seminar",
    title: "Code-ए-Manipal",
    organizer: "CryptoWorld",
    date: "Apr 15, 2024",
    price: "$59",
    match: "87% Match",
    image: "/9999.jpeg",
    link: "https://codemanipal.devfolio.co/"
  }
  // Add more events here
];

export default function Events() {
  return (
    <div className="bg-transparent text-white min-h-screen p-6">
      <h2 className="text-5xl font-bold mb-8 text-center"><span className="text-blue-600">U</span>pcoming Events</h2>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition hover:scale-105">
            <Image src={event.image} alt={event.title} width={400} height={250} className="w-full h-40 object-cover" />
            <div className="p-4">
              <span className="bg-blue-600 text-xs uppercase px-2 py-1 rounded-md">{event.category}</span>
              <h3 className="text-lg font-semibold mt-2">{event.title}</h3>
              <p className="text-sm text-gray-400">{event.organizer}</p>
              <p className="text-sm text-gray-400 mt-1">📅 {event.date}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-yellow-400 font-semibold">⭐ {event.match}</span>
                <span className="text-white font-bold">{event.price}</span>
              </div>
              <a href={event.link} target="_blank" rel="noopener noreferrer">
                <button className="mt-4 w-full bg-blue-600 hover:bg-[#57FF31] text-white py-2 rounded-md text-sm font-medium transition">
                  Register Now
                </button>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
