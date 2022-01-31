interface Props {
  text: string
}

export const Heading = ({ text }: Props) => (
  <h1 className="font-bold text-3xl mb-4">{text}</h1>
)
