interface StakeItemProps {
  /**
   * stake item text
   */
  text: string
  /**
   * sub text
   */
  subText: string
}

export const StakeItem = ({ text, subText }: StakeItemProps) => (
  <div className="flex justify-between mb-2">
    <span className="text-lg leading-6 font-semibold">{text}</span>
    <span className="text-lg leading-6 font-normal text-gray-600">
      {subText}
    </span>
  </div>
)
