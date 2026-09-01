export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const exaResponse = await fetch('https://api.exa.ai/agent/runs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EXA_API_KEY}`
      },
      body: JSON.stringify({
        query: `Inspect the jewelry website URL: ${url}. Extract the diamond specifications (carat, cut, color, clarity), the metal type, and the retail price. Calculate the true raw material manufacturing cost and the retail markup.`,
        systemPrompt: "You are a master jeweler and diamond manufacturer. You will extract the retail price from the provided URL, estimate the true manufacturing cost of the raw materials, and output the retail markup percentage.",
        effort: "low",
        outputSchema: {
          type: "object",
          required: ["retail_price", "manufacturing_cost", "markup_percentage", "specs"],
          properties: {
            retail_price: { type: "number", description: "The listed retail price on the website." },
            manufacturing_cost: { type: "number", description: "The estimated true manufacturing cost in USD." },
            markup_percentage: { type: "number", description: "The retail markup percentage." },
            specs: { type: "string", description: "A brief summary of the diamond and metal specs." }
          }
        }
      })
    });

    const run = await exaResponse.json();

    let status = run.status;
    let finalRun = run;
    let attempts = 0;

    while ((status === 'queued' || status === 'running') && attempts < 15) {
      await new Promise(r => setTimeout(r, 2000));
      const pollResponse = await fetch(`https://api.exa.ai/agent/runs/${run.id}`, {
        headers: {
          'Authorization': `Bearer ${process.env.EXA_API_KEY}`
        }
      });
      finalRun = await pollResponse.json();
      status = finalRun.status;
      attempts++;
    }

    if (status === 'completed') {
       return res.status(200).json(finalRun.output.structured);
    } else {
       return res.status(500).json({ error: 'Agent timeout or failed', details: finalRun });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
