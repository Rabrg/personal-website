export const metadata = {
    title: 'Quotes',
    description: 'A collection of quotes.'
  }
  
  type Quote = {
    text: string
    author: string
    work?: string
  }
  
  const quotesData: Quote[] = [
    {
      text: "The peculiar self-debasement of a man consists in this,—when he makes himself an instrument to a temporary and perishable purpose, and deigns to spend care and labour on something else than the imperishable and eternal.",
      author: 'Johann Gottlieb Fichte',
      work: 'On the Nature of the Scholar'
    },
    {
        text: "When I need, then I shall have, because I know that it is just to give more to whoever asks for more, my demand is my size, my emptiness is my measure.",
        author: 'Clarice Lispector',
        work: 'The Passion According to G.H.'
    },
    {
        text: "For love is ever the beginning of Knowledge, as fire is of light.",
        author: 'Thomas Carlyle',
        work: 'Death of Goethe'
    },
    {
      text: "The strength of a person's spirit would then be measured by how much 'truth' he could tolerate, or more precisely, to what extent he needs to have it diluted, disguised, sweetened, muted, falsified.",
      author: 'Friedrich Nietzsche',
      work: 'Beyond Good and Evil'
    },
    {
        text: "Sapere aude!",
        author: 'Horace',
        work: 'First Book of Letters'
    },
    {
        text: "If there be one lesson more than another that should pierce his ear, it is—The world is nothing, the man is all; in yourself is the law of all nature, and you know not yet how a globule of sap ascends; in yourself slumbers the whole of Reason; it is for you to know all; it is for you to dare all.",
        author: 'Ralph Waldo Emerson',
        work: 'The American Scholar'
    },
  ]
  
  export default function QuotesPage() {
    return (
      <section>
        <h1 className="font-semibold text-2xl mb-6 tracking-tighter">Quotes</h1>
        <ul className="list-disc ml-6">
          {quotesData.map((quote, index) => (
            <li key={index} className="mb-2">
              <span>“{quote.text}”</span> — <span className="font-bold">{quote.author}</span>
              {quote.work && <span className="italic">, {quote.work}</span>}
            </li>
          ))}
        </ul>
      </section>
    )
  }
  