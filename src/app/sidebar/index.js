import React from "react";
import SourceBox from '../dragBox/sourceBox';

const originData = [
  {
    type: 'label',
    background: 'red',
  },
  {
    type: 'select',
    background: 'green'
  },
]

function Page({ className,  data = originData }) {
  return (
    <div className={`${className ?? ""}`}>
      <div>
        打印对象
      </div>
      <div>
        {
          data.map(item => (
            <SourceBox type={item.type} key={item.type}>
              <div style={{ width: 100, height: 20, background: item.background, margin: '10px 0'}}>
                {item.type}
              </div>
            </SourceBox>
          ))
        }
      </div> 
    </div>
  )
}

export default Page;
