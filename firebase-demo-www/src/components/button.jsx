import styled from "styled-components"

const ActionButton = styled(Button)``

const determineBackgroundColor = (props) => {
  switch (props.type) {
    case "EXPENSE":
      return `
            background-color: red;
        `
    default:
      return `
        background-color: blue;
    `
  }
}

const DisabledButton = styled(ActionButton)`
  background-color: ${(props) => determineBackgroundColor(props)};
  cursor: not-allowed;
`

export const Button = (props) => {
  const { disabled } = props

  const category = {
    type: "EXPENSE",
  }

  return <DisabledButton type={category.type} disabled={disabled} />
}
