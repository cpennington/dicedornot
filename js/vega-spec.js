import { valueArray } from "vega-lite/build/src/channeldef";

const breakPoints = [-0.5, -0.4, -0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5]

const vegaSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
  width: 'container',
  height: 500,
  layer: [
    {
      data: { name: 'simulated' },
      transform: [
        {
          calculate: "join([datum.activeTeamId, datum.activeTeamName], '. ')",
          as: 'activeTeamColor'
        },
        {
          window: [{ op: 'sum', field: 'netValue', as: 'cumNetValue' }],
          groupby: ['activeTeamId', 'iteration', 'type']
        }
      ],
      layer: [
        {
          transform: [
            {
              aggregate: [
                { op: 'min', field: 'cumNetValue', as: 'teamMinNetValue' },
                { op: 'max', field: 'cumNetValue', as: 'teamMaxNetValue' }
              ],
              groupby: ['rollIndex', 'turn', 'activeTeamColor', 'activeTeamName']
            },
            {
              joinaggregate: [
                { op: 'min', field: 'teamMinNetValue', as: 'minNetValue' },
                { op: 'max', field: 'teamMaxNetValue', as: 'maxNetValue' }
              ]
            },
            {
              calculate: 'datum.rollIndex - 0.5',
              as: 'x'
            },
            {
              calculate: 'datum.rollIndex + 0.5',
              as: 'x2'
            }
          ],
          mark: {
            type: 'rect',
            opacity: 0.05
          },
          encoding: {
            x: { field: 'x', type: 'quantitative' },
            x2: { field: 'x2', type: 'quantitative' },
            y: { field: 'minNetValue', type: 'quantitative', title: 'Net Value' },
            y2: {
              field: 'maxNetValue',
              type: 'quantitative',
              title: 'Net Value'
            },
            color: {
              field: 'activeTeamColor', type: 'nominal',
              legend: {
                disable: true
              },
            },
            tooltip: [
              { field: 'turn', title: 'Turn' },
              { field: 'activeTeamName', title: 'Active Team' }
            ]
          }
        },
        {
          transform: [
            {
              quantile: 'cumNetValue',
              probs: [0.01, 0.1, 0.25, 0.5, 0.75, 0.9, 0.99],
              groupby: ['activeTeamColor', 'rollIndex']
            },
            {
              calculate: 'datum.prob * 100',
              as: 'perc'
            }
          ],
          mark: {
            type: 'line',
            opacity: 0.3,
            interpolate: 'basis'
          },
          encoding: {
            x: {
              type: 'quantitative',
              field: 'rollIndex',
              title: 'Action',
              axis: {
                labelExpr: 'floor(datum.label)'
              }
            },
            y: {
              field: 'value',
              type: 'quantitative',
              title: 'Net Value'
            },
            color: {
              field: 'activeTeamColor',
              type: 'nominal',
              title: 'Team',
              legend: {
                disable: true
              },
            },
            detail: {
              field: 'prob',
              type: 'nominal'
            },
            tooltip: [
              { field: 'activeTeamColor', title: 'Active Team' },
              { field: 'value', title: 'Cumulative Net Value', format: '.2f' },
              { field: 'perc', title: 'Percentile', format: '.0f' }
            ]
          }
        }
      ]
    },
    {
      data: { name: 'actual' },
      transform: [
        {
          calculate: "join([datum.activeTeamId, datum.activeTeamName], '. ')",
          as: 'activeTeamColor'
        },
        {
          window: [{ op: 'sum', field: 'netValue', as: 'cumNetValue' }],
          groupby: ['activeTeamId', 'iteration', 'type']
        },
        {
          calculate: "'#roll-' + datum.rollIndex",
          as: 'url'
        },
      ],
      layer: [
        {
          mark: { type: 'line', interpolate: 'monotone' },
          encoding: {
            x: {
              type: 'quantitative',
              field: 'rollIndex',
              title: 'Action',
              axis: {
                labelExpr: 'floor(datum.label)'
              }
            },
            y: {
              field: 'cumNetValue',
              type: 'quantitative',
              title: 'Net Value'
            },
            color: {
              field: 'activeTeamColor',
              type: 'nominal',
              title: 'Active Team',
              legend: {
                disable: true
              },
            },
            detail: {
              field: 'iteration',
              type: 'nominal'
            }
          }
        },
        {
          transform: [
            {
              calculate: 'datum.cumNetValue - datum.netValue + datum.dnvMin',
              as: 'y'
            },

            {
              calculate: 'datum.cumNetValue - datum.netValue + datum.dnvMax',
              as: 'y2'
            }
          ],
          mark: {
            type: 'rule',
            opacity: 0.7
          },
          encoding: {
            x: {
              type: 'quantitative',
              field: 'rollIndex'
            },
            y: {
              field: 'y',
              type: 'quantitative',
              scale: { zero: false },
              title: null
            },
            y2: { field: 'y2' },
            color: {
              field: 'activeTeamColor',
              type: 'nominal',
              title: 'Team',
              legend: {
                disable: true
              },
            },
            size: { value: 1 },
            tooltip: [
              { field: 'dnvMin', title: 'Min Net Value', format: '.2f' },
              { field: 'dnvq33', title: '1/6 Net Value', format: '.2f' },
              { field: 'dnvq67', title: '5/6 Net Value', format: '.2f' },
              { field: 'dnvMax', title: 'Max Net Value', format: '.2f' }
            ]
          }
        },
        {
          transform: [
            {
              calculate: 'datum.cumNetValue - datum.netValue + datum.dnvq33 - 0.05',
              as: 'y'
            },
            {
              calculate: 'datum.cumNetValue - datum.netValue + datum.dnvq67 + 0.05',
              as: 'y2'
            },
            {
              calculate: 'datum.rollIndex - 0.4',
              as: 'x'
            },
            {
              calculate: 'datum.rollIndex + 0.4',
              as: 'x2'
            }
          ],
          mark: {
            type: 'bar',
            opacity: 0.7
          },
          encoding: {
            size: { value: 2 },
            x: {
              type: 'quantitative',
              field: 'x'
            },
            x2: {
              type: 'quantitative',
              field: 'x2',
            },
            y: { field: 'y', type: 'quantitative' },
            y2: { field: 'y2', type: 'quantitative' },
            color: {
              field: 'activeTeamColor',
              type: 'nominal',
              title: 'Team',
              legend: {
                disable: true
              },
            },
            tooltip: [
              { field: 'dnvMin', title: 'Min Net Value', format: '.2f' },
              { field: 'dnvq33', title: '1/6 Net Value', format: '.2f' },
              { field: 'dnvq67', title: '5/6 Net Value', format: '.2f' },
              { field: 'dnvMax', title: 'Max Net Value', format: '.2f' }
            ]
          }
        },
        {
          transforms: [
            {
              flatten: ['outcome', 'weight'],
            },
            // {
            //   calculate: 'datum.value + datum.cumNetValue',
            //   as: 'possibleNetValue'
            // },
          ],
          mark: {
            type: "circle",
            opacity: 0.7,
            tooltip: { content: true },
          },
          encoding: {
            x: {
              type: 'quantitative',
              field: 'weight'
            },
            y: {
              type: 'quantitative',
              field: 'outcome',
              // bin: true,
            },
            color: {
              field: 'activeTeamColor',
              type: 'nominal',
              title: 'Team',
              legend: {
                disable: true,
              },
            },
          }
        },
        {
          mark: { type: 'point' },
          selection: {
            zoom_x: { type: "interval", bind: "scales", encodings: ["x"] },
          },
          encoding: {
            x: {
              type: 'quantitative',
              field: 'rollIndex'
            },
            y: {
              field: 'cumNetValue',
              type: 'quantitative',
              title: 'Net Value'
            },
            color: {
              field: 'activeTeamColor',
              type: 'nominal',
              title: 'Team',
              legend: {
                disable: true,
              },
            },
            tooltip: [
              { field: 'turn', title: 'Turn' },
              { field: 'activeTeamName', title: 'Active Team' },
              { field: 'description', title: 'Roll' },
              { field: 'valueDescription', title: 'Value' },
              { field: 'netValue', title: 'Net Value', format: '.2f' },
              {
                field: 'cumNetValue',
                title: 'Cumulative Net Value',
                format: '.2f'
              },
            ],
            href: { field: 'url', type: 'nominal' }
          }
        }
      ]
    }
  ]
  // }
};

export default vegaSpec;
